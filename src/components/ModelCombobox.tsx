'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { VRM_MODELS } from '@/constants/models';

interface ModelComboboxProps {
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
}

export function ModelCombobox({ selectedModelId, onSelectModel }: ModelComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const selectedModel = VRM_MODELS.find(m => m.id === selectedModelId) || VRM_MODELS[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="gap-2 bg-white/85 shadow-[0_10px_26px_-18px_rgba(0,0,0,0.6)] hover:shadow-[0_16px_30px_-18px_rgba(0,0,0,0.65)] px-3 border border-neutral-200 hover:border-neutral-300 rounded-full h-9 font-semibold text-neutral-800 text-sm transition hover:-translate-y-0.5"
        >
          {selectedModel.avatar && (
            <Image
              src={selectedModel.avatar}
              alt={selectedModel.name}
              width={20}
              height={20}
              className="shadow-[0_6px_14px_-10px_rgba(0,0,0,0.45)] border border-white/70 rounded-full w-6 h-6 object-cover"
            />
          )}
          <span className="hidden sm:inline whitespace-nowrap">{selectedModel.name}</span>
          <ChevronsUpDown className="w-4 h-4 text-neutral-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-white/95 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)] backdrop-blur p-0 border border-neutral-100 w-52">
        <Command>
          <CommandInput placeholder="Search model..." className="bg-white/70 border-neutral-100 border-b h-9 font-medium text-neutral-700 text-sm placeholder-neutral-400" />
          <CommandList>
            <CommandEmpty className="py-6 text-neutral-500 text-sm text-center">No model found.</CommandEmpty>
            <CommandGroup>
              {VRM_MODELS.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.name}
                  onSelect={(currentValue) => {
                    const selectedId = VRM_MODELS.find(m => m.name === currentValue)?.id;
                    if (selectedId) {
                      onSelectModel(selectedId);
                      setOpen(false);
                    }
                  }}
                  className="gap-3 data-[highlighted]:bg-neutral-50 px-3 py-2 text-neutral-700 transition cursor-pointer"
                >
                  {model.avatar && (
                    <div className="shadow-[0_8px_18px_-14px_rgba(0,0,0,0.45)] border border-neutral-100 rounded-full w-9 h-9 overflow-hidden">
                      <Image
                        src={model.avatar}
                        alt={model.name}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <span>{model.name}</span>
                  <Check
                    className={cn(
                      'ml-auto w-4 h-4 text-neutral-800',
                      selectedModelId === model.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
