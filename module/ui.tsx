import { redirect } from "react-router-dom";
import { LoginPage } from "./page/LoginPage";
import { RegisterPage } from "./page/RegisterPage";
import { CONFIG_UI_USER } from "./config-ui";

export const LIST_PAGE_USER = {
  '/login': {
    async loader() {
      const session = localStorage.getItem('token');
      if (session) {
        return redirect(CONFIG_UI_USER.has_logged_in_redirect_path);
      }

      return {};
    },
    Component: LoginPage
  },
  '/register': {
    async loader() {
      const session = localStorage.getItem('token');
      if (session) {
        return redirect(CONFIG_UI_USER.has_logged_in_redirect_path);
      }

      return {};
    },
    Component: RegisterPage
  }
}

export function logoutUser() {
  localStorage.removeItem('token');
  window.location.href = CONFIG_UI_USER.logout_redirect_path;
}
