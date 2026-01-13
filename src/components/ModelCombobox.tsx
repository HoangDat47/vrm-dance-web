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
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-2 lg:px-3 py-1 lg:py-1.5 border border-white/20 hover:border-white/40 h-auto text-white text-xs lg:text-sm transition-colors"
        >
          {selectedModel.avatar && (
            <Image
              src={selectedModel.avatar}
              alt={selectedModel.name}
              width={20}
              height={20}
              className="rounded-full"
            />
          )}
          <span className="hidden sm:inline">{selectedModel.name}</span>
          <ChevronsUpDown className="opacity-50 w-3 lg:w-4 h-3 lg:h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-48">
        <Command>
          <CommandInput placeholder="Search model..." className="h-9" />
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            <CommandGroup>
              {VRM_MODELS.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={(currentValue) => {
                    onSelectModel(currentValue);
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  {model.avatar && (
                    <Image
                      src={model.avatar}
                      alt={model.name}
                      width={32}
                      height={32}
                      className="border border-white/20 rounded-full"
                    />
                  )}
                  <span>{model.name}</span>
                  <Check
                    className={cn(
                      'ml-auto w-4 h-4',
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
