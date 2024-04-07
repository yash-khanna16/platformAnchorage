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
      // updateListings
      // console.log(data);
    })
    location.reload();
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
      $('.roomDiv').empty(); // Clear previous data
      data.forEach(room => {
        const roomHTML = `
          <button type="button" class="btn btn-primary roomModal" data-bs-toggle="modal"
            data-bs-target="#room-${room.roomNumber}">
            ${room.roomNumber}
          </button>
          <div class="modal fade" id="room-${room.roomNumber}" data-bs-backdrop="static" data-bs-keyboard="false"
            tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog custom-modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="staticBackdropLabel">${room.roomNumber}</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <!-- Form and room details -->
                  <form action="/platformAnchorage/roomScheduling/addBooking" method="post">
                    <input type="hidden" name="roomNumber" id="${room.roomNumber}" value="${room.roomNumber}">
                    <input type="text" name="guestName" id="guestName" placeholder="Enter Name">
                    <input type="number" name="guestPhone" id="guestPhone" placeholder="Enter phone">
                    <input type="datetime-local" name="checkInDateTime" id="checkInDateTime"
                      placeholder="Enter checkin">
                    <input type="datetime-local" name="checkOutDateTime" id="checkOutDateTime"
                      placeholder="Enter checkout">

                    <button type="submit" class="addBookingBtn">Submit Now</button>
                  </form>
                  <!-- Table for room bookings -->
                  <div class="table1">
                    <table>
                      <tr class="rows">
                        <th class="medium">Room Number</th>
                        <th class="long">Guest Name</th>
                        <th class="small">Guest Phone</th>
                        <th class="small">Check In</th>
                        <th class="medium">Check Out</th>
                      </tr>
                      ${room.bookings.forEach(booking=>{`
                        <tr class="rows">
                        <td class="medium">${room.roomNumber}</td>
                        <td class="small">${booking.guestName}</td>
                        <td class="small">${booking.guestPhone}</td>
                        <td class="medium">${booking.checkInDateTime}</td>
                        <td class="medium">${booking.checkOutDateTime}</td>
                      </tr>
                      `
                      })}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        $('.roomDiv').append(roomHTML);
      });
    });
  });
});