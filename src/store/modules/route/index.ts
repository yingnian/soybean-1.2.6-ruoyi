import { computed, ref, shallowRef } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import { useBoolean } from '@sa/hooks';
import type { CustomRoute, ElegantConstRoute, LastLevelRouteKey, RouteKey, RouteMap } from '@elegant-router/types';
import { SetupStoreId } from '@/enum';
import { router } from '@/router';
import { createStaticRoutes, getAuthVueRoutes } from '@/router/routes';
import { ROOT_ROUTE } from '@/router/routes/builtin';
import { getRouteName, getRoutePath } from '@/router/elegant/transform';
import { fetchIsRouteExist } from '@/service/api';
import { fetchGetUserRoutes } from '@/service/api/system/login';
import { useAppStore } from '../app';
import { useAuthStore } from '../auth';
import { useTabStore } from '../tab';
import {
  filterAuthRoutesByRoles,
  getBreadcrumbsByRoute,
  getCacheRouteNames,
  getGlobalMenusByAuthRoutes,
  getSelectedMenuKeyPathByKey,
  isRouteExistByRouteName,
  sortRoutesByOrder,
  transformMenuToSearchMenus,
  updateLocaleOfGlobalMenus
} from './shared';

export const useRouteStore = defineStore(SetupStoreId.Route, () => {
  const appStore = useAppStore();
  const authStore = useAuthStore();
  const tabStore = useTabStore();
  const { bool: isInitConstantRoute, setBool: setIsInitConstantRoute } = useBoolean();
  const { bool: isInitAuthRoute, setBool: setIsInitAuthRoute } = useBoolean();

  /**
   * Auth route mode
   *
   * It recommends to use static mode in the development environment, and use dynamic mode in the production
   * environment, if use static mode in development environment, the auth routes will be auto generated by plugin
   * "@elegant-router/vue"
   */
  const authRouteMode = ref(import.meta.env.VITE_AUTH_ROUTE_MODE);

  /** Home route key */
  const routeHome = ref(import.meta.env.VITE_ROUTE_HOME);

  /**
   * Set route home
   *
   * @param routeKey Route key
   */
  function setRouteHome(routeKey: LastLevelRouteKey) {
    routeHome.value = routeKey;
  }

  /** constant routes */
  const constantRoutes = shallowRef<ElegantConstRoute[]>([]);

  function addConstantRoutes(routes: ElegantConstRoute[]) {
    const constantRoutesMap = new Map<string, ElegantConstRoute>([]);

    routes.forEach(route => {
      constantRoutesMap.set(route.name, route);
    });

    constantRoutes.value = Array.from(constantRoutesMap.values());
  }

  /** auth routes */
  const authRoutes = shallowRef<ElegantConstRoute[]>([]);

  // 若依路由转换为soybean路由
  const setRuoyiRouteToSoybean = (routeAry: any[], newAry: any[] | null, parentName: string) => {
    routeAry.forEach((item, index) => {
      const i = item.meta ? item : item.children[0];
      const _path = i.path.split('/').length > 1 ? i.path.split('/')[1] : i.path;
      let path = '';
      let name = '';
      const currentParentMenu = '';
      let component = '';
      const pathFromParentName =
        parentName && parentName.split('_').length > 1 ? parentName.split('_').join('/') : parentName;
      switch (i.meta.menuType) {
        case 'M': // 目录
          component = 'layout.base';
          path = parentName ? `${pathFromParentName}/${_path}` : `/${_path}`;
          name = parentName ? `${parentName}_${_path}` : _path;
          break;
        case 'C': // 菜单
          if (i.component === 'iframe') {
            path = parentName ? `/${pathFromParentName}/${index}` : `/leveloneIframe_${index}`;
            name = parentName ? `${parentName}_${index}` : `leveloneIframe_${index}`;
          } else {
            path = parentName ? `/${pathFromParentName}/${_path}` : `/${index}`;
            name = parentName ? `${parentName}_${_path}` : _path;
            component = `view.${name}`;
          }
          break;
        default: // 按钮级不计入路由范围，所以写什么都无所谓
          name = i.path;
          path = i.path;
      }

      const tempItem = {
        name,
        path,
        realPath: (item && item.realPath) || '',
        component: component || 'layout.base',
        children: i.children && i.children.length ? [] : null,
        meta: {
          ...i.meta,
          localIcon: i.meta.icon,
          requiresAuth: true,
          order: i.meta.orderNum,
          status: Number(i.meta.status) || 1,
          keepAlive: !Number(i.meta.isCache),
          isFrame: !Number(i.meta.isFrame),
          hideInMenu: Boolean(Number(i.meta.hide)),
          activeMenu: i.meta.activeMenu || '',
          affix: !Number(i.meta.affix) || false,
          singleLayout: i.meta.parentId === 0 && i.meta.menuType === 'C' ? 'base' : '',
          currentParentMenu,
          href: '',
          multiTab: true
        }
      };

      if (i.children && i.children.length) {
        setRuoyiRouteToSoybean(i.children, tempItem.children, name);
      }
      if (Array.isArray(newAry)) newAry.push(tempItem);
    });
  };

  function addAuthRoutes(routes: ElegantConstRoute[]) {
    const newRouteAry: any[] = [];
    setRuoyiRouteToSoybean(routes, newRouteAry, '');

    newRouteAry.unshift({
      name: 'home',
      path: '/home',
      component: 'layout.base$view.home',
      meta: {
        title: '首页',
        requiresAuth: true,
        icon: 'PhHouseFill',
        localIcon: 'PhHouseFill',
        order: 1
      }
    });
    console.log('若依转换过后的路由', newRouteAry);
    authRoutes.value = newRouteAry;
  }

  const removeRouteFns: (() => void)[] = [];

  /** Global menus */
  const menus = ref<App.Global.Menu[]>([]);
  const searchMenus = computed(() => transformMenuToSearchMenus(menus.value));

  /** Get global menus */
  function getGlobalMenus(routes: ElegantConstRoute[]) {
    menus.value = getGlobalMenusByAuthRoutes(routes);
  }

  /** Update global menus by locale */
  function updateGlobalMenusByLocale() {
    menus.value = updateLocaleOfGlobalMenus(menus.value);
  }

  /** Cache routes */
  const cacheRoutes = ref<RouteKey[]>([]);

  /** All cache routes */
  const allCacheRoutes = shallowRef<RouteKey[]>([]);

  /**
   * Get cache routes
   *
   * @param routes Vue routes
   */
  function getCacheRoutes(routes: RouteRecordRaw[]) {
    const alls = getCacheRouteNames(routes);

    cacheRoutes.value = alls;
    allCacheRoutes.value = [...alls];
  }

  /**
   * Add cache routes
   *
   * @param routeKey
   */
  function addCacheRoutes(routeKey: RouteKey) {
    if (cacheRoutes.value.includes(routeKey)) return;

    cacheRoutes.value.push(routeKey);
  }

  /**
   * Remove cache routes
   *
   * @param routeKey
   */
  function removeCacheRoutes(routeKey: RouteKey) {
    const index = cacheRoutes.value.findIndex(item => item === routeKey);

    if (index === -1) return;

    cacheRoutes.value.splice(index, 1);
  }

  /**
   * Is cached route
   *
   * @param routeKey
   */
  function isCachedRoute(routeKey: RouteKey) {
    return allCacheRoutes.value.includes(routeKey);
  }

  /**
   * Re cache routes by route key
   *
   * @param routeKey
   */
  async function reCacheRoutesByKey(routeKey: RouteKey) {
    if (!isCachedRoute(routeKey)) return;

    removeCacheRoutes(routeKey);

    await appStore.reloadPage();

    addCacheRoutes(routeKey);
  }

  /**
   * Re cache routes by route keys
   *
   * @param routeKeys
   */
  async function reCacheRoutesByKeys(routeKeys: RouteKey[]) {
    for await (const key of routeKeys) {
      await reCacheRoutesByKey(key);
    }
  }

  /** Global breadcrumbs */
  const breadcrumbs = computed(() => getBreadcrumbsByRoute(router.currentRoute.value, menus.value));

  /** Reset store */
  async function resetStore() {
    const routeStore = useRouteStore();

    routeStore.$reset();

    resetVueRoutes();

    // after reset store, need to re-init constant route
    await initConstantRoute();
  }

  /** Reset vue routes */
  function resetVueRoutes() {
    removeRouteFns.forEach(fn => fn());
    removeRouteFns.length = 0;
  }

  /** 初始化常量路由 */
  async function initConstantRoute() {
    if (isInitConstantRoute.value) return;

    const staticRoute = createStaticRoutes();

    addConstantRoutes(staticRoute.constantRoutes);
    // 由于若依本身没有此配置（常量路由存在数据库中），所以就直接赋予本地路由
    // if (authRouteMode.value === 'static') {
    //   addConstantRoutes(staticRoute.constantRoutes);
    // } else {
    //   const { data, error } = await fetchGetConstantRoutes();

    //   if (!error) {
    //     addConstantRoutes(data);
    //   } else {
    //     // if fetch constant routes failed, use static constant routes
    //     addConstantRoutes(staticRoute.constantRoutes);
    //   }
    // }

    handleConstantAndAuthRoutes();

    setIsInitConstantRoute(true);
  }

  /** Init auth route */
  async function initAuthRoute() {
    if (authRouteMode.value === 'static') {
      initStaticAuthRoute();
    } else {
      await initDynamicAuthRoute();
    }

    tabStore.initHomeTab();
  }

  /** Init static auth route */
  function initStaticAuthRoute() {
    const { authRoutes: staticAuthRoutes } = createStaticRoutes();

    if (authStore.isStaticSuper) {
      addAuthRoutes(staticAuthRoutes);
    } else {
      const filteredAuthRoutes = filterAuthRoutesByRoles(staticAuthRoutes, authStore.userInfo.roles);

      addAuthRoutes(filteredAuthRoutes);
    }

    handleConstantAndAuthRoutes();

    setIsInitAuthRoute(true);
  }

  /** 初始化动态路由 */
  async function initDynamicAuthRoute() {
    const { data: routes, error } = await fetchGetUserRoutes();

    if (!error) {
      addAuthRoutes(routes);

      handleConstantAndAuthRoutes();

      setRouteHome(import.meta.env.VITE_ROUTE_HOME);

      handleUpdateRootRouteRedirect(import.meta.env.VITE_ROUTE_HOME);

      setIsInitAuthRoute(true);
    } else {
      // if fetch user routes failed, reset store
      authStore.resetStore();
    }
  }

  /** handle constant and auth routes */
  function handleConstantAndAuthRoutes() {
    const allRoutes = [...constantRoutes.value, ...authRoutes.value];

    const sortRoutes = sortRoutesByOrder(allRoutes);

    const vueRoutes = getAuthVueRoutes(sortRoutes);

    resetVueRoutes();

    addRoutesToVueRouter(vueRoutes);

    getGlobalMenus(sortRoutes);

    getCacheRoutes(vueRoutes);
  }

  /**
   * Add routes to vue router
   *
   * @param routes Vue routes
   */
  function addRoutesToVueRouter(routes: RouteRecordRaw[]) {
    routes.forEach(route => {
      const removeFn = router.addRoute(route);
      addRemoveRouteFn(removeFn);
    });
  }

  /**
   * Add remove route fn
   *
   * @param fn
   */
  function addRemoveRouteFn(fn: () => void) {
    removeRouteFns.push(fn);
  }

  /**
   * Update root route redirect when auth route mode is dynamic
   *
   * @param redirectKey Redirect route key
   */
  function handleUpdateRootRouteRedirect(redirectKey: LastLevelRouteKey) {
    const redirect = getRoutePath(redirectKey);

    if (redirect) {
      const rootRoute: CustomRoute = { ...ROOT_ROUTE, redirect };

      router.removeRoute(rootRoute.name);

      const [rootVueRoute] = getAuthVueRoutes([rootRoute]);

      router.addRoute(rootVueRoute);
    }
  }

  /**
   * Get is auth route exist
   *
   * @param routePath Route path
   */
  async function getIsAuthRouteExist(routePath: RouteMap[RouteKey]) {
    const routeName = getRouteName(routePath);

    if (!routeName) {
      return false;
    }

    if (authRouteMode.value === 'static') {
      const { authRoutes: staticAuthRoutes } = createStaticRoutes();
      return isRouteExistByRouteName(routeName, staticAuthRoutes);
    }

    const { data } = await fetchIsRouteExist(routeName);

    return data;
  }

  /**
   * Get selected menu key path
   *
   * @param selectedKey Selected menu key
   */
  function getSelectedMenuKeyPath(selectedKey: string) {
    return getSelectedMenuKeyPathByKey(selectedKey, menus.value);
  }

  /**
   * Get route meta by key
   *
   * @param key Route key
   */
  function getRouteMetaByKey(key: string) {
    const allRoutes = router.getRoutes();

    return allRoutes.find(route => route.name === key)?.meta || null;
  }

  /**
   * Get route query of meta by key
   *
   * @param key
   */
  function getRouteQueryOfMetaByKey(key: string) {
    const meta = getRouteMetaByKey(key);

    const query: Record<string, string> = {};

    meta?.query?.forEach(item => {
      query[item.key] = item.value;
    });

    return query;
  }

  return {
    resetStore,
    routeHome,
    menus,
    searchMenus,
    updateGlobalMenusByLocale,
    cacheRoutes,
    reCacheRoutesByKey,
    reCacheRoutesByKeys,
    breadcrumbs,
    initConstantRoute,
    isInitConstantRoute,
    initAuthRoute,
    isInitAuthRoute,
    setIsInitAuthRoute,
    getIsAuthRouteExist,
    getSelectedMenuKeyPath,
    getRouteQueryOfMetaByKey
  };
});
