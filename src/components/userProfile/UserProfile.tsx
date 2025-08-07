import React from 'react';
import type { User } from '../../types';
import {  EnvelopeIcon, CalendarIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface UserProps {
  user: User;
}

export const UserProfile: React.FC<UserProps> = ({ user }) => {
  const createdAtDate = user.createdAt ? new Date(user.createdAt) : null;
  const formattedDate = createdAtDate ? createdAtDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }) : '';

  const getRoleLabel = (role?: string) => {
    switch(role) {
      case 'ADMIN': return 'Administrador';
      case 'MANAGER': return 'Gerente';
      case 'OPERATOR': return 'Operador';
      case 'SELLER': return 'Vendedor';
      default: return 'Usuário';
    }
  };

  const getRoleBadgeColor = (role?: string) => {
    switch(role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800';
      case 'MANAGER': return 'bg-blue-100 text-blue-800';
      case 'OPERATOR': return 'bg-green-100 text-green-800';
      case 'SELLER': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
      {/* Banner de fundo */}
      <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
      
      <div className="relative px-6 pb-8">
        {/* Avatar */}
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <img
              src={user.avatarUrl || '/default-avatar.png'}
              alt="Avatar"
              className="w-36 h-36 rounded-full border-4 border-white object-cover shadow-lg"
            />
          </div>
        </div>

        {/* Informações do usuário */}
        <div className="pt-20 text-center">
          <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 mx-auto ${getRoleBadgeColor(user.role)}`}>
            {getRoleLabel(user.role)}
          </span>
          
          <div className="mt-6 space-y-4 max-w-md mx-auto">
            <div className="flex items-center justify-center md:justify-start text-gray-600">
              <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-500" />
              <span>{user.email}</span>
            </div>
            
            <div className="flex items-center justify-center md:justify-start text-gray-600">
              <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
              <span>Membro desde {formattedDate}</span>
            </div>
            
            {user.companyId && (
              <div className="flex items-center justify-center md:justify-start text-gray-600">
                <BuildingOfficeIcon className="h-5 w-5 mr-2 text-gray-500" />
                <span>Empresa ID: {user.companyId}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
