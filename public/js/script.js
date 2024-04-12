$(() => {
  const deleteBtn = $(".deleteBtn");
  deleteBtn.on("click", (ev) => {
    // console.log("click hua")
    // console.log(ev);
    let id = ev.target.id;
    // console.log(ev.target.id);

    // let attribute = ev.target.getAttribute('class');
    // console.log(attribute);
    $.post(
      '/platformAnchorage/admin/deleteGuestDetails', {
      id
    }).done((data) => {
      // updateListings
      console.log(data);
    })
    location.reload();
  });
});

// show or hide details
// function toggleDetails() {
//   alert("i nkjdsbvvbks");
//   var details = document.querySelector(".product-details");
//   var button = document.querySelector("button");

//   if (details.style.display === "none") {
//     details.style.display = "block";
//     button.textContent = "Hide Details";
//   } else {
//     details.style.display = "none";
//     button.textContent = "Show More Details";
//   }
// }

// $(document).ready(function () {
//   $("#toggleButton").click(function () {
//     $("#product-details").toggle();
//   });
// });

// document.getElementById("toggleButton").addEventListener("onclick", function () {
//   var details = document.getElementById("details");
//   console.log(hiii);
//   if (details.style.display === "none") {
//     details.style.display = "block";
//   } else {
//     details.style.display = "none";
//   }
// });

$(() => {
  const toggleButton = $(".toggleButton");
  const details = $(".details");
  toggleButton.on("click", (ev) => {
    console.log(ev);
    let id = ev.target.id;
    console.log(ev.target.id);
    $("div").show("slow");
  });
});

// $(() => {
//   let formData = $('#bookingForm').serialize();
//   console.log(formData);
// });

  // $.ajax({
  //     type: 'POST',
  //     url: '/platformAnchorage/roomScheduling/addBooking',
  //     data: formData,
  //     success: function(response) {
  //         // Handle success, for example update modal content or display a success message
  //         console.log('Booking submitted successfully');
  //     },
  //     error: function(xhr, status, error) {
  //         // Handle error
  //         console.error('Error submitting booking:', error);
  //     }
  // });


// $(() => {
//   const sendEmail = $(".sendEmail");
//   sendEmail.on("click", (ev) => {
//     // console.log(ev);
//     // let id = ev.target.id;
//     // console.log(ev.target.id);
//     console.log("click confirmed")
//     // let attribute = ev.target.getAttribute('class');
//     // console.log(attribute);
//     $.post(
//         '/platformAnchorage/admin/sendEmails',{
//         }).done((data)=>{
//           // updateListings
//           console.log(data);
//         })
//     location.reload();
//   });
// });


// $(() => {
//   const guest_form = $(".addbtn my-2 mx-4");
//   guest_form.on("submit", (ev) => {
//     ev.preventDefault()
//     console.log("click confirmed")

//   });
// });

$(() => {
  const selectGuest = $(".selectGuest");
  selectGuest.on("click", (ev) => {
    // console.log("click hua")
    // console.log(ev);
    let id = ev.target.id;
    // console.log(ev.target.id);

    // let attribute = ev.target.getAttribute('class');
    // console.log(attribute);
    $.post(
      '/platformAnchorage/admin/sendMulticastEmails', {
      id
    }).done((data) => {
      // updateListings
      console.log(data);
    })
    location.reload();
  });
});


$(() => {
  const deleteRoom = $(".deleteRoom");
  deleteRoom.on("click", (ev) => {
    // console.log("click hua")
    // console.log(ev);
    let id = ev.target.id;
    // console.log(ev.target.id);

    // let attribute = ev.target.getAttribute('class');
    // console.log(attribute);
    $.post(
      '/platformAnchorage/roomScheduling/deleteRooms', {
      id
    }).done((data) => {
      location.reload();
      // updateListings
      // console.log(data);
    })
    
  });
});

$(() => {
  const checkAvailableRoomsForRange = $(".checkAvailableRoomsForRange");
  checkAvailableRoomsForRange.on("click", () => {
    const checkInDateTime = $("#checkInDateTime").val();
    const checkOutDateTime = $("#checkOutDateTime").val();

    $.post('/platformAnchorage/roomScheduling/checkAvailability', {
      checkInDateTime,
      checkOutDateTime
    }).done((data) => {
      console.log(data)
      $('.Available').empty(); // Clear previous data
      data.forEach(room => {
        const roomHTML = `
          <button type="button" class="btn btn-primary roomModal" data-bs-toggle="modal"
            data-bs-target="#room-${room.roomNumber}">
            ${room.roomNumber}
          </button>
          `
        $('.Available').append(roomHTML);
      });
    });
  });
});

$(() => {
  const deleteRoom = $(".deleteRoom");
  deleteRoom.on("click", (ev) => {
    // console.log("click hua")
    // console.log(ev);
    let id = ev.target.id;
    // console.log(ev.target.id);

    // let attribute = ev.target.getAttribute('class');
    // console.log(attribute);
    $.post(
      '/platformAnchorage/roomScheduling/deleteRooms', {
      id
    }).done((data) => {
      location.reload();
      // updateListings
      // console.log(data);
    })
    
  });
});

$('.deleteBookingBtn').on('click', function() {
  const row = $(this).closest('tr'); // Get the closest row containing the booking details

  const roomNumber = $(this).data('room-number');
  const checkInDateTime = $(this).data('check-in-datetime'); 
  const checkOutDateTime = $(this).data('check-out-datetime'); 

  $.ajax({
      url: '/platformAnchorage/roomScheduling/deleteBooking', // Update the URL as per your backend route
      method: 'POST',
      data: { roomNumber, checkInDateTime, checkOutDateTime },
      success: function(response) {
          row.remove(); // Remove the corresponding row from the table upon successful deletion
          location.reload()
          console.log("Booking deleted successfully");
      },
      error: function(xhr, status, error) {
          console.error(error);
          alert('Failed to delete booking');
      }
  });
});
