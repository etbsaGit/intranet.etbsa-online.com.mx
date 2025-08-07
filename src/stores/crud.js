import { defineStore } from "pinia";
import { ref } from "vue";
import { sendRequest, dataIncomplete } from "src/boot/functions";

export const useCrudStore = defineStore("crud", () => {
  // Lista completa sin paginación
  const items = ref([]);

  // Lista paginada + info de paginación
  const paginatedItems = ref([]);
  const pagination = ref({
    currentPage: 1,
    nextPageUrl: null,
    prevPageUrl: null,
    lastPage: 1,
  });

  const filters = ref({});

  // Obtener todos los items sin paginación
  const getItems = async (url) => {
    const res = await sendRequest("GET", null, url, "");
    items.value = res;
    return res;
  };

  // Obtener items paginados vía POST con filtros
  const getPaginatedItems = async (url, filters = {}) => {
    const res = await sendRequest("POST", filters, url, "");

    paginatedItems.value = res.data || [];

    pagination.value = {
      currentPage: res.current_page || filters.page || 1,
      nextPageUrl: res.next_page_url,
      prevPageUrl: res.prev_page_url,
      lastPage: res.last_page || 1,
    };

    return res;
  };

  const postItem = async (url, data, validateFn, onSuccess = () => {}) => {
    const valid = await validateFn();
    if (!valid) {
      dataIncomplete();
      return;
    }
    const res = await sendRequest("POST", data, url, "");
    onSuccess(res);
  };

  const putItem = async (url, data, validateFn, onSuccess = () => {}) => {
    const valid = await validateFn();
    if (!valid) {
      dataIncomplete();
      return;
    }
    const res = await sendRequest("PUT", data, `${url}/${data.id}`, "");
    onSuccess(res);
  };

  const deleteItem = async (url, id, onSuccess = () => {}) => {
    const res = await sendRequest("DELETE", null, `${url}/${id}`, "");
    onSuccess(res);
  };

  return {
    items, // lista completa
    paginatedItems, // lista paginada
    pagination,
    filters,
    getItems,
    getPaginatedItems,
    postItem,
    putItem,
    deleteItem,
  };
});
