$(document).ready(function () {
  // Simple hardcoded user for demo
  const users = {
    admin: "123123",
  };

  // In-memory storage for students (RFID -> student data)
  var cards = {
    "0009591945": {
      firstname: "Matthew",
      lastname: "Atoy",
      section: "12 - Del Mundo",
      adviser: "John Gabriel",
      contact: "092222123123",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTys0v3wo4Nz04p5L6xhVlvI2a_2GNGkDlkA&s",
    },
    "0008865767": {
      firstname: "Clove",
      lastname: "Rocks",
      section: "12 - Del Mundo",
      adviser: "EWAN KO",
      contact: "092222",
      image:
        "https://preview.redd.it/fan-art-clove-v0-518zfb2v0arc1.jpg?width=2000&format=pjpg&auto=webp&s=13bf52d0e79e0fd08735b0fea1f61f401fa237c6",
    },
    "0008836571": {
      firstname: "Rhenz",
      lastname: "Soriano",
      section: "12 - Aranilla",
      adviser: "Brian Francia",
      contact: "092222",
      image:
        "484052844_672866778606031_1453962573907768239_n.jpg",
    },
  };

  // Show/hide sections helper
  function showSection(id) {
    $(".section").removeClass("active");
    $("#" + id).addClass("active");
    // Show header on public screens (student reg, login, recovery)
    if (id === "studentRegScreen" || id === "loginScreen" || id === "passwordRecoveryScreen") {
      $("header").show();
    }
    // Hide header on authenticated screens (dashboard, book issue)
    else if (id === "dashboardScreen" || id === "bookIssueScreen") {
      $("header").hide();
    }
  }

  // Initial show of header (for student reg default)
  $("header").show();

  // Librarian Login Button (from header)
  $("#librarianLoginBtn").click(() => {
    showSection("loginScreen");
    $("#loginError").text("");
    $("#username").val("");
    $("#password").val("");
  });

  // Student Registration Form
  $("#studentRegForm").on("submit", function (e) {
    e.preventDefault();
    const firstname = $("#studentFirstname").val().trim();
    const lastname = $("#studentLastname").val().trim();
    const section = $("#studentSection").val().trim();
    const adviser = $("#studentAdviser").val().trim();
    const contact = $("#studentContact").val().trim();
    const imageUrl = $("#studentImage").val().trim();

    if (!firstname || !lastname || !section || !adviser || !contact) {
      $("#studentRegMessage").text("Please fill all required fields.").addClass("error");
      return;
    }

    // Generate a simple RFID (000 + 7 random digits for demo)
    const rfid = "000" + Math.floor(Math.random() * 10000000).toString().padStart(7, "0");

    // Add to cards object
    cards[rfid] = {
      firstname,
      lastname,
      section,
      adviser,
      contact,
      image: imageUrl || "",
    };

    // Show success message with RFID
    $("#studentRegMessage")
      .text(`Student registered successfully! RFID: ${rfid}`)
      .removeClass("error")
      .addClass("success");

    // Clear form
    $("#studentRegForm")[0].reset();

    // Optionally, clear message after 5 seconds
    setTimeout(() => {
      $("#studentRegMessage").text("");
    }, 5000);
  });

  // Login form submit
  $("#loginForm").on("submit", function (e) {
    e.preventDefault();
    const username = $("#username").val().trim();
    const password = $("#password").val();
    if (users[username] && users[username] === password) {
      $("#loginError").text("");
      showSection("dashboardScreen"); // This will hide header
    } else {
      $("#loginError").text("Invalid username or password");
    }
  });

  // Password recovery
  $("#passwordRecoveryBtn").click(() => {
    showSection("passwordRecoveryScreen");
    $("#recoveryMessage").text("");
    $("#recoveryEmail").val("");
  });
  $("#backToLoginBtn").click(() => {
    showSection("loginScreen");
  });
  $("#recoveryForm").on("submit", function (e) {
    e.preventDefault();
    const email = $("#recoveryEmail").val().trim();
    // Simulate sending recovery email
    $("#recoveryMessage").text(
      "If this email is registered, a recovery link has been sent."
    ).addClass("success");
  });

  // Dashboard buttons
  $("#viewStudentsBtn").click(() => {
    // Show the students list
    $("#studentsList").show();

    // Populate the table
    const tbody = $("#studentsTable tbody");
    tbody.empty();
    Object.keys(cards).forEach((rfid) => {
      const student = cards[rfid];
      tbody.append(`
        <tr>
          <td>${rfid}</td>
          <td>${student.firstname || ""}</td>
          <td>${student.lastname || ""}</td>
          <td>${student.section || ""}</td>
          <td>${student.adviser || ""}</td>
          <td>${student.contact || ""}</td>
          <td></td> <!-- Actions placeholder -->
        </tr>
      `);
    });
  });

  $("#btnIssueBook").click(() => {
    showSection("bookIssueScreen"); // This will hide header
    $("#RFIDCARD").val("").focus();
    $("#error").text("");
    // Clear student info
    $("#img").attr("src", "");
    $("#fname, #lname, #section, #adviser, #contact").text("");
  });

  $("#btnLogout").click(() => {
    showSection("loginScreen"); // This will show header
    $("#username").val("");
    $("#password").val("");
    // Hide students list if open
    $("#studentsList").hide();
  });

  $("#backToDashboardFromIssue").click(() => {
    showSection("dashboardScreen"); // This will hide header
  });

  // RFID Card Scanning (for book issue screen)
  // Auto-focus on RFID input when in book issue screen
  $("body").on("mousemove click keydown", function () {
    if ($("#bookIssueScreen").hasClass("active")) {
      $("#RFIDCARD").focus();
    }
  });

  // Handle RFID input (Enter key to process)
  $("#RFIDCARD").on("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      var inputVal = $(this).val().trim();
      if (inputVal && cards.hasOwnProperty(inputVal)) {
        var card = cards[inputVal];
        $("#img").attr("src", card.image || "https://cdn-icons-png.flaticon.com/512/565/565547.png");
        $("#fname").text(card.firstname || "");
        $("#lname").text(card.lastname || "");
        $("#section").text(card.section || "");
        $("#adviser").text(card.adviser || "");
        $("#contact").text(card.contact || "");
        $("#error").text(""); // Clear any error
        // Here you could add logic to actually issue a book (e.g., log it, show success)
        // For demo, just show student info
      } else {
        $("#img").attr(
          "src",
          "https://cdn-icons-png.flaticon.com/512/565/565547.png" // Default placeholder
        );
        $("#fname, #lname, #section, #adviser, #contact").text(""); // Clear values
        $("#error").text("Card not recognized or invalid RFID.");
      }
      $(this).val(""); // Clear input for next scan
    }
  });

  // Initial focus if starting in book issue (unlikely, but for completeness)
  if ($("#bookIssueScreen").hasClass("active")) {
    $("#RFIDCARD").focus();
  }
});