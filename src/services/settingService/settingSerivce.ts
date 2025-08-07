import type { Setting } from "../../types/setting";
import { api } from "../api/api";

export const settingsService = {
  async getAll(): Promise<Setting[]> {
    const res = await api.get("/settings");
    return res.data;
  },

  async getByKey(key: string): Promise<Setting> {
    const res = await api.get(`/settings/${key}`);
    return res.data;
  },

  async update(key: string, data: { value: string }): Promise<Setting> {
    const res = await api.patch(`/settings/${key}`, data);
    return res.data;
  },

  async create(data: { key: string; value: string }): Promise<Setting> {
    const res = await api.post("/settings", data);
    return res.data;
  },
};
