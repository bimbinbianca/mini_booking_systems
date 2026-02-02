const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const bookings = ref([]);
    const activeRoom = ref(null);
    const bookingDate = ref('');
    const userName = ref('');
    const startTime = ref('');
    const endTime = ref('');
    const errorMessage = ref('');

    const rooms = ref([
      { id: 1, name: "Ruang VIP A", capacity: 60, location: "Gedung A Lantai 3", status: "Available" },
      { id: 2, name: "Ruang Meeting B", capacity: 40, location: "Gedung B Lantai 2", status: "Available" },
      { id: 3, name: "Ruang Kecil C", capacity: 20, location: "Gedung C Lantai 1", status: "Available" },
    ]);

    onMounted(() => {
      const storedRooms = localStorage.getItem("rooms");
      const storedBookings = localStorage.getItem("bookings");
      if (storedRooms) rooms.value = JSON.parse(storedRooms);
      if (storedBookings) bookings.value = JSON.parse(storedBookings);
    });

    const saveToStorage = () => {
      localStorage.setItem("rooms", JSON.stringify(rooms.value));
      localStorage.setItem("bookings", JSON.stringify(bookings.value));
    };

    const selectRoom = (room) => {
      activeRoom.value = room;
      errorMessage.value = '';
    };

    const bookRoom = (roomId) => {
      errorMessage.value = '';

      if (!bookingDate.value || !startTime.value || !endTime.value || !userName.value) {
        errorMessage.value = "Semua field harus diisi";
        return;
      }

      if (startTime.value >= endTime.value) {
        errorMessage.value = "Waktu mulai harus lebih awal dari waktu selesai";
        return;
      }

      const conflict = bookings.value.find(b =>
        b.roomId === roomId &&
        b.date === bookingDate.value &&
        (
          (startTime.value >= b.startTime && startTime.value < b.endTime) ||
          (endTime.value > b.startTime && endTime.value <= b.endTime) ||
          (startTime.value <= b.startTime && endTime.value >= b.endTime)
        )
      );

      if (conflict) {
        errorMessage.value = "Booking bentrok dengan jadwal lain";
        return;
      }

      bookings.value.push({
        id: bookings.value.length + 1,
        roomId,
        userName: userName.value,
        date: bookingDate.value,
        startTime: startTime.value,
        endTime: endTime.value,
        status: "Booked"
      });

      const room = rooms.value.find(r => r.id === roomId);
      if (room) room.status = "Booked";

      saveToStorage();

      resetForm();
    };

    const cancelForm = () => {
      resetForm();
    };

    const resetForm = () => {
      activeRoom.value = null;
      userName.value = '';
      bookingDate.value = '';
      startTime.value = '';
      endTime.value = '';
      errorMessage.value = '';
    };

    return {
      rooms,
      activeRoom,
      bookingDate,
      startTime,
      endTime,
      userName,
      errorMessage,
      bookRoom,
      cancelForm,
      selectRoom,
      bookings
    };
  }
}).mount('#app');
