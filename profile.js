const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const bookings = ref([]);
    const rooms = ref([]);
    const enrichedBookings = ref([]);

    onMounted(() => {
      const storedRooms = localStorage.getItem("rooms");
      const storedBookings = localStorage.getItem("bookings");

      if (storedRooms) rooms.value = JSON.parse(storedRooms);
      if (storedBookings) bookings.value = JSON.parse(storedBookings);

      enrichBookings();
    });

    const enrichBookings = () => {
      enrichedBookings.value = bookings.value.map(b => {
        const room = rooms.value.find(r => r.id === b.roomId) || {};
        return {
          ...b,
          roomName: room.name || "Unknown Room",
          location: room.location || "-"
        };
      });
    };

    const saveToStorage = () => {
      localStorage.setItem("rooms", JSON.stringify(rooms.value));
      localStorage.setItem("bookings", JSON.stringify(bookings.value));
    };

    const cancelBooking = (booking) => {
      const room = rooms.value.find(r => r.id === booking.roomId);
      if (room) room.status = "Available";

      bookings.value = bookings.value.filter(b => b.id !== booking.id);

      saveToStorage();
      enrichBookings();
    };

    return { enrichedBookings, cancelBooking };
  }
}).mount("#app");
