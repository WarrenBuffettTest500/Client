const setCookie = (name, value, days) => {
  let expires = '';

  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }

  const domain
    = process.env.NODE_ENV === 'development'
      ? 'localhost'
      : '.warrenbuffett-test500.site';

  document.cookie = `${name}=${value || ''}${expires}; path=/; Domain=${domain}`;
};

export default setCookie;
