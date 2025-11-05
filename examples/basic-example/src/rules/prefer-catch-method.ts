export async function preferCatchMethod() {
  let result;
  // eslint-disable-next-line wyrm/prefer-catch-method
  try {
    result = await getFoo();
    console.log('Fetched foo');
  } catch (error) {
    console.error(error);
    result = null;
  }
  return result;
}

export async function preferCatchMethod2() {
  let result;
  // eslint-disable-next-line wyrm/prefer-catch-method
  try {
    result = await getFoo();
  } catch (error) {
    console.error(error);
  }
  return result;
}

async function getFoo() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ msg: 'Ok' });
    }, 1000);
  });
}
