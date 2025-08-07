import { useEffect, useState } from "react";
import type { Setting } from "../../types/setting";
import { PencilIcon } from "@heroicons/react/24/outline";
import SettingForm from "./SettingForm";
import { toast } from "react-toastify";
import LoadingSpinner from "../loading/LoadingSpinner";
import { settingsService } from "../../services/settingService/settingSerivce";

const SettingList = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getAll();
      setSettings(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar configurações");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Configurações do Sistema</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nova Configuração
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner />
        </div>
      ) : settings.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma configuração encontrada.</p>
      ) : (
        <ul className="divide-y divide-gray-200 bg-white rounded shadow">
          {settings.map((s) => (
            <li
              key={s.id}
              className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
            >
              <div>
                <p className="font-bold">{s.key}</p>
                <p className="text-gray-600">{s.value}</p>
                {s.description && (
                  <p className="text-xs text-gray-400">{s.description}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedSetting(s)}
                className="text-blue-600 hover:text-blue-800"
                title="Editar"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {(selectedSetting || isCreating) && (
        <SettingForm
          setting={selectedSetting || undefined}
          onClose={() => {
            setSelectedSetting(null);
            setIsCreating(false);
          }}
          onSaved={() => {
            fetchSettings();
            setSelectedSetting(null);
            setIsCreating(false);
          }}
        />
      )}
    </div>
  );
};

export default SettingList;
