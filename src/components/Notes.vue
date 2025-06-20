<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { supabase } from '@/supabaseClient.ts';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

onMounted(() => {
  fetchNotes();
});

const notes = ref([]);

const fetchNotes = async () => {
  let { data: ingredientsData, error } = await supabase
      .from('notes')
      .select('*');

  if (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: `${error.message}`, life: 3000 });
  }

  notes.value = ingredientsData;
};
</script>

<template>
  <DataTable
    :value="notes"
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
      field="category"
      header="Fragrance Wheel Category"
    />
    <Column
      field="subcategory"
      header="Fragrance Wheel Subcategory"
    />
    <Column
      field="user_category"
      header="User-friendly Category"
    />
    <Column
      field="user_subcategory"
      header="User-friendly Subcategory"
    />
  </DataTable>
  <Toast />
</template>
