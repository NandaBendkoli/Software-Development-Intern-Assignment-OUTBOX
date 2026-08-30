export const getLogin = (req: any, res: any) => {
  res.redirect("http://localhost:5173/dashboard");
};

export const getUser = async (req: any, res: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logoutUser = async (req: any, res: any, next: any) => {
  req.logout((err: any) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((err: any) => {
      if (err) {
        return next(err);
      }

      res.clearCookie("connect.sid");

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    });
  });
};
export const failedAuthentication = (req: any, res: any) => {
  return res.status(401).json({
    success: false,
    message: "Google authentication failed",
  });
};
