'use client';

import { useParams, useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { AddsTab } from '@/domains/adds/model/types';
import { SaleList } from '@/domains/adds/ui/SaleList';

const DEFAULT_TAB: AddsTab = 'sale';
const VALID_TABS: AddsTab[] = ['sale', 'rent', 'hotel'];

function getValidTab(value: string | string[] | undefined): AddsTab {
  const v = Array.isArray(value) ? value[0] : value;
  if (v && VALID_TABS.includes(v as AddsTab)) return v as AddsTab;
  return DEFAULT_TAB;
}

export default function AddsTabPage() {
  const params = useParams<{ tab: string | string[] }>();
  const router = useRouter();

  const currentTab = getValidTab(params?.tab);

  const handleTabChange = (value: string) => {
    const next = getValidTab(value);
    router.push(`/adds/${next}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full border-b bg-background/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Anunțuri</h1>
            <p className="text-sm text-muted-foreground">
              Vânzare, închiriere și hoteluri într-o singură pagină, cu URL-uri curate pe fiecare tab.
            </p>
          </div>
        </div>
      </div>

        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Tabs
          value={currentTab}
          onValueChange={handleTabChange}
          className="w-full flex-1 flex flex-col"
        >
          <TabsList className="inline-flex">
            <TabsTrigger value="sale">Sale</TabsTrigger>
            <TabsTrigger value="rent">Rent</TabsTrigger>
            <TabsTrigger value="hotel">Hotel</TabsTrigger>
          </TabsList>

          <div className="mt-4 flex-1">
            <TabsContent value="sale" className="flex-1">
              <SaleList />
            </TabsContent>

            <TabsContent value="rent" className="flex-1">
              <div className="min-h-[40vh] flex flex-col items-center justify-center gap-2 border border-dashed border-border rounded-2xl bg-muted/30">
                <p className="text-sm font-medium text-muted-foreground">
                  Zona Rent este în construcție.
                </p>
                <p className="text-xs text-muted-foreground">
                  În curând vei putea filtra și explora toate proprietățile de închiriat aici.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="hotel" className="flex-1">
              <div className="min-h-[40vh] flex flex-col items-center justify-center gap-2 border border-dashed border-border rounded-2xl bg-muted/30">
                <p className="text-sm font-medium text-muted-foreground">
                  Zona Hotel este în construcție.
                </p>
                <p className="text-xs text-muted-foreground">
                  În curând vei putea vedea hoteluri și cazări premium integrate în aceeași experiență.
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}