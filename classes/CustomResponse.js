class CustomResponse {
  static STATUSES = {
    success: "success",
    fail: "fail",
  };
  status;
  msg;
  constructor(status, msg) {
    this.status = status;
    this.msg = msg;
  }
}
module.exports = CustomResponse;
