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


$(() => {
  const guest_form = $(".addbtn my-2 mx-4");
  guest_form.on("submit", (ev) => {
    ev.preventDefault()
    console.log("click confirmed")

  });
});

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
  checkAvailableRoomsForRange.on("click", (ev) => {
    // console.log("click hua")
    // console.log(ev);
    console.log(ev);
    const checkInDateTime = $("#checkInDateTime").val();
    const checkOutDateTime = $("#checkOutDateTime").val();
    console.log(checkOutDateTime)
    // console.log(ev.target.id);

    // let attribute = ev.target.getAttribute('class');
    // console.log(attribute);
    
  });
});
