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
import { BACKGROUNDS } from '@/constants/backgrounds';

interface BackgroundComboboxProps {
  selectedBackgroundId: string;
  onSelectBackground: (backgroundId: string) => void;
}

export function BackgroundCombobox({ selectedBackgroundId, onSelectBackground }: BackgroundComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const selectedBackground = BACKGROUNDS.find(b => b.id === selectedBackgroundId) || BACKGROUNDS[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="gap-2 bg-linear-to-r from-purple-600 to-pink-500 shadow-[0_10px_30px_-18px_rgba(109,40,217,0.9)] hover:shadow-[0_16px_34px_-18px_rgba(109,40,217,0.9)] px-3 border border-purple-200 rounded-full h-9 font-semibold text-white text-sm transition hover:-translate-y-0.5"
        >
          {selectedBackground.thumbnail && (
            <Image
              src={selectedBackground.thumbnail}
              alt={selectedBackground.name}
              width={20}
              height={20}
              className="shadow-[0_6px_14px_-10px_rgba(0,0,0,0.55)] border border-white/60 rounded-full w-6 h-6 object-cover"
            />
          )}
          <span className="hidden sm:inline whitespace-nowrap">{selectedBackground.name}</span>
          <ChevronsUpDown className="w-4 h-4 text-white/80" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-white/95 shadow-[0_18px_40px_-24px_rgba(109,40,217,0.35)] backdrop-blur p-0 border border-purple-100 w-52">
        <Command>
          <CommandInput placeholder="Search background..." className="bg-white/70 border-purple-100 border-b h-9 font-medium text-neutral-700 text-sm placeholder-neutral-400" />
          <CommandList>
            <CommandEmpty className="py-3 font-semibold text-neutral-500 text-xs text-center">No background found.</CommandEmpty>
            <CommandGroup>
              {BACKGROUNDS.map((background) => (
                <CommandItem
                  key={background.id}
                  value={background.name}
                  onSelect={(currentValue) => {
                    const selectedId = BACKGROUNDS.find(b => b.name === currentValue)?.id;
                    if (selectedId) {
                      onSelectBackground(selectedId);
                      setOpen(false);
                    }
                  }}
                  className="flex flex-col items-start gap-2 data-[highlighted]:bg-purple-50/90 hover:bg-purple-50/70 px-3 py-2 border-purple-50 border-b text-neutral-700 text-sm transition cursor-pointer"
                >
                  {background.thumbnail && (
                    <div className="shadow-[0_12px_30px_-24px_rgba(109,40,217,0.5)] border border-purple-100 rounded-xl w-full h-20 overflow-hidden">
                      <Image
                        src={background.thumbnail}
                        alt={background.name}
                        width={160}
                        height={90}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex justify-between items-center w-full">
                    <span className="font-semibold text-neutral-800">{background.name}</span>
                    <Check
                      className={cn(
                        'w-4 h-4 text-purple-600',
                        selectedBackgroundId === background.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </div>
                  <span className="text-neutral-500 text-xs">{background.description}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
