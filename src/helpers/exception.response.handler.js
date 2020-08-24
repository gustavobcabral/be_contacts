/* eslint-disable @typescript-eslint/no-use-before-define */
const exceptionResponseHandler = fn => async (req, res, next) => {
  await fn(req, res, next).catch(error => {
    // eslint-disable-next-line promise/no-callback-in-promise
    return next(error)
  })
}

export default exceptionResponseHandler
