// RSA加密

import JSEncrypt from 'jsencrypt';

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCuoKgE+Az+oqCsTe+jhJUbwuunErNLy5m8deIkJwwzXYl7lw6WVpNQLErHYYcJCs/ixP38JFnnGSB1DKhn/+xX+Me71akmJQGsEPH0dZOig4VKNFLiTP/EAGzMGzTymJk+YSIZFT9oaGh01SHq+ut3lxChLVwgcultwlahvpJNiwIDAQAB';

// 加密
export const encrypt = (txt: string) => {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(txt); // 对数据进行加密
};
