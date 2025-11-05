export async function preferCatchMethod() {
  let result;
  // eslint-disable-next-line wyrm/prefer-catch-method
  try {
    result = await getFoo();
    console.log('Fetched foo');
  } catch (err) {
    console.error(err);
    result = null;
  }
  return result;
}

async function getFoo() {
  return Promise.resolve({ msg: 'Ok' });
}
