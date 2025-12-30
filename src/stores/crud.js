import { defineStore } from "pinia";
import { ref } from "vue";
import { sendRequest, dataIncomplete } from "src/boot/functions";

export const useCrudStore = defineStore("crud", () => {
  const loading = ref(false);

  const items = ref([]);

  const paginatedItems = ref([]);
  const pagination = ref({
    currentPage: 1,
    nextPageUrl: null,
    prevPageUrl: null,
    lastPage: 1,
    perPage: 10,
    total: 0,
    from: 0,
    to: 0,
  });

  const filters = ref({});

  const getItems = async (url) => {
    loading.value = true;
    try {
      const res = await sendRequest("GET", null, url);
      items.value = res || [];
      return res;
    } finally {
      loading.value = false;
    }
  };

  const getPaginatedItems = async (url, filtersParam = {}) => {
    loading.value = true;
    try {
      const res = await sendRequest("POST", filtersParam, url);

      const paginator = res?.data?.current_page !== undefined ? res.data : res;

      paginatedItems.value = paginator?.data || [];

      pagination.value = {
        currentPage: paginator?.current_page || filtersParam.page || 1,
        nextPageUrl: paginator?.next_page_url || null,
        prevPageUrl: paginator?.prev_page_url || null,
        lastPage: paginator?.last_page || 1,
        perPage: paginator?.per_page || 10,
        total: paginator?.total || 0,
        from: paginator?.from || 0,
        to: paginator?.to || 0,
      };

      return res;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Crear
   */
  const postItem = async (url, data, validateFn, onSuccess = () => {}) => {
    const valid = await validateFn();
    if (!valid) {
      dataIncomplete();
      return false;
    }

    const res = await sendRequest("POST", data, url);
    onSuccess(res);
    return true;
  };

  /**
   * Actualizar
   */
  const putItem = async (url, data, validateFn, onSuccess = () => {}) => {
    const valid = await validateFn();
    if (!valid) {
      dataIncomplete();
      return false;
    }

    const res = await sendRequest("PUT", data, `${url}/${data.id}`);
    onSuccess(res);
    return true;
  };

  /**
   * Eliminar
   */
  const deleteItem = async (url, id, onSuccess = () => {}) => {
    const res = await sendRequest("DELETE", null, `${url}/${id}`);
    onSuccess(res);
  };

  return {
    // state
    items,
    loading,
    paginatedItems,
    pagination,
    filters,

    // actions
    getItems,
    getPaginatedItems,
    postItem,
    putItem,
    deleteItem,
  };
});
