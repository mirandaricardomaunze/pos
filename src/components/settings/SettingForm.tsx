import { useState } from "react";
import type { SettingsProps } from "../../types/setting";
import LoadingSpinner from "../loading/LoadingSpinner";
import { toast } from "react-toastify";
import Input from "../ui/input";
import Button from "../ui/button";
import { settingsService } from "../../services/settingService/settingSerivce";
import { SETTING_KEYS } from "../../constants/settings";

const SettingForm = ({ setting, onClose, onSaved }: SettingsProps) => {
  const [key, setKey] = useState(setting?.key || "");
  const [value, setValue] = useState(setting?.value || "");
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(setting);

  const handleSubmit = async () => {
    if (!key.trim()) {
      toast.error("A chave é obrigatória");
      return;
    }
    if (!value.trim()) {
      toast.error("O valor é obrigatório");
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await settingsService.update(key, { value });
      } else {
        await settingsService.create({ key, value });
      }
      toast.success("Configuração salva com sucesso!");
      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar configuração.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-40 z-50 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {isEdit ? `Editar: ${setting?.key}` : "Nova Configuração"}
        </h3>

        {!isEdit ? (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Chave</label>
            <select
              value={key}
              onChange={(e) => setKey(e.target.value)}
              disabled={loading}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
            >
              <option value="">Selecione uma chave</option>
              {SETTING_KEYS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="mb-2 text-sm">
            <strong>Chave:</strong> {key}
          </p>
        )}

        <Input
          placeholder="Valor"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
          className="mb-4"
        />

        <div className="flex justify-end space-x-2">
          <Button className="bg-gray-300" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            className="bg-blue-600 text-white"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : "Salvar"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingForm;
