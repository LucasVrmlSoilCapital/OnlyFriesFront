import React from 'react';
import { MenuItemOptionT } from '../../types/menu';

interface MenuItemModalOptionProps {
  option: MenuItemOptionT;
  selectedOptions: { [optionId: string]: number[] };
  onOptionChange: (optionId: string, choiceId: number, isChecked: boolean) => void;
  canSelectMore: (option: MenuItemOptionT) => boolean;
}

export const MenuItemModalOption: React.FC<MenuItemModalOptionProps> = ({
  option,
  selectedOptions,
  onOptionChange,
  canSelectMore
}) => {
  return (
    <div className="bg-white rounded-xl border border-cream-200 p-5 shadow-soft">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-800 mb-1">
            {option.name?.fr || option.name?.en || 'Option'}
            {option.required && <span className="text-error-500 ml-2">*</span>}
          </h3>
          
          {option.description && (
            <p className="text-sm text-neutral-600 mb-2">
              {option.description?.fr || option.description?.en || ''}
            </p>
          )}

          {option.max && option.max > 1 && (
            <p className="text-xs text-primary-600 font-medium bg-primary-50 px-2 py-1 rounded-lg inline-block">
              Maximum {option.max} choix
            </p>
          )}
        </div>

        <div className="space-y-2">
          {option.options
            .filter(choice => choice.active)
            .map((choice) => {
              const isSelected = selectedOptions[option.id]?.includes(choice.id) || false;
              const canSelect = canSelectMore(option) || isSelected;
              
              return (
                <div
                  key={choice.id}
                  className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-cream-200 bg-cream-50 hover:bg-cream-100 hover:border-cream-300'
                  } ${!canSelect && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => {
                    if (canSelect || isSelected) {
                      onOptionChange(option.id, choice.id, !isSelected);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                        isSelected 
                          ? 'border-primary-500 bg-primary-500' 
                          : 'border-neutral-300 bg-white'
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        )}
                      </div>
                      <span className="font-medium text-neutral-800">
                        {choice.name?.fr || choice.name?.en || 'Choix'}
                      </span>
                    </div>
                    {choice.price.regular && (
                      <span className="text-success-600 font-bold text-sm">
                        +{parseFloat(choice.price.regular).toFixed(2)}€
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}; 