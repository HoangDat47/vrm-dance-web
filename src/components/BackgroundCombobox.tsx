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
          className="gap-2 bg-linear-to-r from-pink-300 hover:from-pink-400 to-purple-300 hover:to-purple-400 shadow-md px-2 lg:px-3 py-0.5 lg:py-1 border-2 border-purple-400 h-auto font-bold text-purple-700 text-xs lg:text-sm transition-all"
        >
          {selectedBackground.thumbnail && (
            <Image
              src={selectedBackground.thumbnail}
              alt={selectedBackground.name}
              width={20}
              height={20}
              className="border border-purple-400 rounded"
            />
          )}
          <span className="hidden sm:inline">{selectedBackground.name}</span>
          <ChevronsUpDown className="w-3 lg:w-4 h-3 lg:h-4 text-purple-700" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-linear-to-b from-blue-50 to-pink-50 shadow-lg p-0 border-2 border-purple-400 w-48">
        <Command>
          <CommandInput placeholder="Search background..." className="bg-white/70 border-purple-300 border-b-2 h-8 font-semibold text-purple-700 text-xs placeholder-purple-400" />
          <CommandList>
            <CommandEmpty className="py-3 font-semibold text-purple-600 text-xs text-center">No background found.</CommandEmpty>
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
                  className="flex flex-col items-start gap-2 data-highlighted:bg-purple-200/60 hover:bg-purple-100/50 p-2 border-purple-200/50 border-b text-purple-700 text-sm cursor-pointer"
                >
                  {background.thumbnail && (
                    <Image
                      src={background.thumbnail}
                      alt={background.name}
                      width={160}
                      height={90}
                      className="border border-purple-300 rounded w-full h-20 object-cover"
                    />
                  )}
                  <div className="flex justify-between items-center w-full">
                    <span className="font-semibold">{background.name}</span>
                    <Check
                      className={cn(
                        'w-4 h-4 text-purple-600',
                        selectedBackgroundId === background.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </div>
                  <span className="text-purple-500 text-xs">{background.description}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
