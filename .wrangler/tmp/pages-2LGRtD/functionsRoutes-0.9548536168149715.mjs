import { onRequestPost as __api_auth_login_ts_onRequestPost } from "E:\\dcelup\\functions\\api\\auth\\login.ts"
import { onRequestDelete as __api_menus_ts_onRequestDelete } from "E:\\dcelup\\functions\\api\\menus.ts"
import { onRequestGet as __api_menus_ts_onRequestGet } from "E:\\dcelup\\functions\\api\\menus.ts"
import { onRequestPost as __api_menus_ts_onRequestPost } from "E:\\dcelup\\functions\\api\\menus.ts"
import { onRequestPut as __api_menus_ts_onRequestPut } from "E:\\dcelup\\functions\\api\\menus.ts"
import { onRequestDelete as __api_promos_ts_onRequestDelete } from "E:\\dcelup\\functions\\api\\promos.ts"
import { onRequestGet as __api_promos_ts_onRequestGet } from "E:\\dcelup\\functions\\api\\promos.ts"
import { onRequestPost as __api_promos_ts_onRequestPost } from "E:\\dcelup\\functions\\api\\promos.ts"
import { onRequestGet as __api_settings_ts_onRequestGet } from "E:\\dcelup\\functions\\api\\settings.ts"
import { onRequestPut as __api_settings_ts_onRequestPut } from "E:\\dcelup\\functions\\api\\settings.ts"
import { onRequest as __api_ping_ts_onRequest } from "E:\\dcelup\\functions\\api\\ping.ts"

export const routes = [
    {
      routePath: "/api/auth/login",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_login_ts_onRequestPost],
    },
  {
      routePath: "/api/menus",
      mountPath: "/api",
      method: "DELETE",
      middlewares: [],
      modules: [__api_menus_ts_onRequestDelete],
    },
  {
      routePath: "/api/menus",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_menus_ts_onRequestGet],
    },
  {
      routePath: "/api/menus",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_menus_ts_onRequestPost],
    },
  {
      routePath: "/api/menus",
      mountPath: "/api",
      method: "PUT",
      middlewares: [],
      modules: [__api_menus_ts_onRequestPut],
    },
  {
      routePath: "/api/promos",
      mountPath: "/api",
      method: "DELETE",
      middlewares: [],
      modules: [__api_promos_ts_onRequestDelete],
    },
  {
      routePath: "/api/promos",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_promos_ts_onRequestGet],
    },
  {
      routePath: "/api/promos",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_promos_ts_onRequestPost],
    },
  {
      routePath: "/api/settings",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_settings_ts_onRequestGet],
    },
  {
      routePath: "/api/settings",
      mountPath: "/api",
      method: "PUT",
      middlewares: [],
      modules: [__api_settings_ts_onRequestPut],
    },
  {
      routePath: "/api/ping",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_ping_ts_onRequest],
    },
  ]