import React, { useState, useEffect } from 'react';
import { RBACPermission, PlatformRole } from '@/types/adminPortal';
import { PermissionService } from '@/services/permissionService';
import { Check, X, ShieldAlert, Lock, Save } from 'lucide-react';
import useToast from '@/hooks/useToast';

export const PermissionMatrix: React.FC = () => {
  const { showToast } = useToast();
  const [permissions, setPermissions] = useState<RBACPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const rolesList: PlatformRole[] = ['STUDENT', 'INDUSTRY_SPOC', 'INSTITUTION_SPOC', 'REVIEWER', 'SUPER_ADMIN'];

  const fetchPermissions = async () => {
    setIsLoading(true);
    try {
      const data = await PermissionService.getPermissions();
      setPermissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleToggle = (key: string, role: PlatformRole) => {
    setPermissions((prev) =>
      prev.map((p) => {
        if (p.key === key) {
          const allowedRoles = p.allowedRoles.includes(role) ? p.allowedRoles.filter((r) => r !== role) : [...p.allowedRoles, role];
          return { ...p, allowedRoles };
        }
        return p;
      })
    );
  };

  const handleSave = async (key: string, allowedRoles: PlatformRole[]) => {
    setIsSaving(true);
    try {
      await PermissionService.updatePermission(key, allowedRoles);
      showToast('Role permissions policy saved.', 'success');
      await fetchPermissions();
    } catch {
      showToast('Failed to save permission policy', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-48 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-150 rounded-3xl overflow-hidden shadow-sm text-left select-none">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              <th className="py-4 px-6 text-left">Ecosystem Permission Feature</th>
              {rolesList.map((r) => (
                <th key={r} className="py-4 px-6 text-center border-l border-zinc-100">
                  {r.replace('_', ' ')}
                </th>
              ))}
              <th className="py-4 px-6 text-center border-l border-zinc-100 w-24">Commit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-xs font-semibold text-zinc-700">
            {permissions.map((p) => (
              <tr key={p.key} className="hover:bg-zinc-50/40 transition-colors">
                <td className="py-4 px-6 leading-tight">
                  <p className="font-extrabold text-zinc-900">{p.label}</p>
                  <span className="text-[9px] font-mono text-zinc-400">Key: {p.key}</span>
                </td>
                {rolesList.map((r) => {
                  const isChecked = p.allowedRoles.includes(r);
                  return (
                    <td key={r} className="py-4 px-6 text-center border-l border-zinc-100">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggle(p.key, r)}
                        className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        disabled={r === 'SUPER_ADMIN'} // Super Admin always gets all permissions
                      />
                    </td>
                  );
                })}
                <td className="py-4 px-6 text-center border-l border-zinc-100">
                  <button
                    onClick={() => handleSave(p.key, p.allowedRoles)}
                    disabled={isSaving}
                    className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg focus:outline-none transition-colors cursor-pointer"
                    title="Save permission rule"
                  >
                    <Save className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
