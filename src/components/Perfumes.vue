<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { supabase } from '@/supabaseClient.ts';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import {useToast} from 'primevue/usetoast';

const toast = useToast();
interface Perfume {
  id: number;
  name: string;
  brand: {
    name: string;
  };
  concentration: string;
  notes: {
    name: string;
    type: string;
  }[];
}

const perfumes = ref<Perfume[]>([]);
let subscription: RealtimeChannel | null;

const fetchPerfumes = async () => {
  let { data: perfumeData, error } = await supabase
      .from('perfumes')
      .select(`
      id,
      name,
      brand:brand_id (
        name
      ),
      concentration,
      notes:perfumes_notes (
        note:notes(name),
        type
      )
    `);

  if (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 300000 });
  }

  const flattenedPerfumeData = perfumeData.map((perfume: Perfume[]) => ({
    ...perfume,
    notes: perfume.notes.map((item) => ({
      name: item.note.name,
      type: item.type
    }))
  }));

  //console.log('Flattened perfumes:', flattenedPerfumeData);

  perfumes.value = flattenedPerfumeData;
};

// Subscribe to realtime changes
const subscribeToPerfumes = () => {

  const channel = supabase.channel('perfumes-channel');

  channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'perfumes'
      },
      (payload: RealtimePostgresChangesPayload<Perfume>) => {
        toast.add({ severity: 'info', summary: 'Info', detail: `Realtime change received:', ${payload.eventType}`, life: 3000 });
        fetchPerfumes();
      }
  ).subscribe();

  return channel;
};

onMounted(() => {
  fetchPerfumes();
  subscription = subscribeToPerfumes();
});

onUnmounted(() => {
  // Unsubscribe to prevent memory leaks
  if (subscription) {
    supabase.removeChannel(subscription);
  }
});
</script>

<template>
  <DataTable
    :value="perfumes"
    table-style="min-width: 50rem"
  >
    <Column
      field="id"
      header="ID"
    />
    <Column
      field="name"
      header="Name"
    />
    <Column
      field="brand.name"
      header="Brand"
    />
    <Column
      field="concentration"
      header="Concentration"
    />
  </DataTable>
  <Toast />
</template>
