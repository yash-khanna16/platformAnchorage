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

$('.deleteBookingBtn').on('click', function () {
  const row = $(this).closest('tr'); // Get the closest row containing the booking details

  const roomNumber = $(this).data('room-number');
  const checkInDateTime = $(this).data('check-in-datetime');
  const checkOutDateTime = $(this).data('check-out-datetime');

  $.ajax({
    url: '/platformAnchorage/roomScheduling/deleteBooking', // Update the URL as per your backend route
    method: 'POST',
    data: { roomNumber, checkInDateTime, checkOutDateTime },
    success: function (response) {
      row.remove(); // Remove the corresponding row from the table upon successful deletion
      location.reload()
      console.log("Booking deleted successfully");
    },
    error: function (xhr, status, error) {
      console.error(error);
      alert('Failed to delete booking');
    }
  });
});
$('.checkForGuest').on('click', function () {
  const guestName = $('#guest_name').val();

  // Send a POST request to the server
  $.post('/platformAnchorage/roomScheduling/findGuest', { guestName })
    .done((data) => {
      console.log(data);
      let tableHTML = '<table class="table2"><tr class="rows2"><th>Room Number</th><th>Guest Name</th><th>Guest Phone</th><th>Check-In Date</th><th>Check-Out Date</th><th>Company Name</th><th>Vessel</th><th>Remark</th><th>Additional</th></tr><tbody>';
      data.forEach(booking => {
        tableHTML += `<tr class="rows2"><td>${booking.roomNumber}</td><td>${booking.bookings.guestName}</td><td>${booking.bookings.guestPhone}</td><td>${booking.bookings.checkInDateTime}</td><td>${booking.bookings.checkOutDateTime}</td><td>${booking.bookings.companyName}</td><td>${booking.bookings.vessel}</td><td>${booking.bookings.remark}</td><td>${booking.bookings.additional}</td></tr>`;
      });
      tableHTML += '</tbody></table>';

      // Append the table to the guestAvailable div
      $('.guestAvailable').html(tableHTML);
    })
    .fail((xhr, status, error) => {
      console.error(error);
      alert('Failed to search for guest');
    });
});

// Wait for the document to be fully loaded
$(document).ready(function () {
  // Add event listener for edit buttons
  
  $('.editBookingBtn').click(function () {
    const checkOutDateTime = $(this).data('check-out-datetime');
      // Find the parent row of the clicked edit button
      var parentRow = $(this).closest('tr');

      // Define an array to store input values
      var inputValues = [];
      var changeinput = false;

      // Loop through each cell in the row, excluding the last two cells (edit and delete buttons)
      parentRow.find('td:not(:last-child):not(:nth-last-child(2))').each(function () {
          var cell = $(this);
          var cellContent = cell.text().trim();

          // Check if the cell already contains an input field
          if (cell.children('input').length) {
              // Revert back to the original content
              var inputValue = cell.children('input').val();
              cell.html(inputValue);

              // Store the input value
              inputValues.push(inputValue);
              changeinput = true;
          } else {
              // Replace the cell contents with input fields
              var cellClass = cell.attr('class');
              var inputValue = $('<input>', {
                  type: 'text',
                  class: cellClass+'1',
                  value: cellContent
              });

              cell.html(inputValue);

              // Store the original text value
              inputValues.push(cellContent);
              changeinput = false;
          }
      });

      if (changeinput) {
          // Send POST request
          $.ajax({
              url: '/platformAnchorage/roomScheduling/editBooking', // Update the URL as per your backend route
              method: 'POST',
              data: { inputValues: inputValues ,checkOutDateTime}, // Send input values as an array
              success: function (response) {
                  console.log('Edit successful');
                  // Revert back to normal table after successful edit
                  setTimeout(function () {
                      location.reload(); // Reload the page to reflect changes
                  }, 1000); // Adjust the delay as needed
              },
              error: function (xhr, status, error) {
                  console.error(error);
                  alert('Failed to edit booking');
                  // Revert back to normal table if there is an error
                  parentRow.find('td').each(function (index) {
                      $(this).text(inputValues[index]);
                  });
              }
          });
      }
  });
});
