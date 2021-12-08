const sumBadge = document.querySelector(".sumBadge");
const sumDone = document.querySelector(".sumDone");
const sumActive = document.querySelector(".sumActive");
const checkFilterDone = document.querySelector("#filter_done");
const checkFilterActive = document.querySelector("#filter_active");

function getJobs() {
  fetch("http://localhost:4000/api/jobs")
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      renderJobs(data);
      let sumJobs = data.length;
      let sumJobsDone = data.filter((item) => item.jobState === false).length;

      sumBadge.innerHTML = sumJobs;
      sumDone.innerHTML = sumJobsDone;
      sumActive.innerHTML = sumJobs - sumJobsDone;
      checkFilterDone.checked = false;
      checkFilterActive.checked = false;
    })
    .catch((error) => console.log(error));
}
getJobs();

function renderJobs(Jobs) {
  let htmls = Jobs.map((job, index) => {
    return ` <tr ${job.jobState == true ? "class='active'" : ""}>
         <th scope="row" class="text-center">${index + 1}</th>
         <td ${job.jobState == false ? "class='strike'" : ""}>${
      job.jobName
    }</td>
         <td  ${job.jobState == false ? "class='strike'" : ""}>${
      job.jobDesc
    }</td>
         <td  ${job.jobState == false ? "class='strike'" : ""}>${
      job.createAt
    }</td>
         <td class="text-center pl-4">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" ${
                job.jobState == true ? "" : "checked"
              } onclick={checkboxClick("${job._id}",${job.jobState})} >
              ${
                job.jobState == true
                  ? "<span class='ml-1 badge bg-warning text-light ml-2 mr-4 p-2 sumBadge'>Đang tiến hành <i class='fas fa-spinner fa-pulse'></i></span>"
                  : "<span class='ml-1 badge bg-success text-light ml-2 mr-4 p-2 sumBadge'>Xong <i class='fas fa-check-double'></i></span>"
              }


        </td>
         <td class="text-center"><button class="btn btn-primary"onclick="handleClickToUpdate('${
           job._id
         }','${job.jobName}','${
      job.jobDesc
    }')">Sửa <i class="fas fa-feather-alt"></i></button></td>
         <td class="text-center"><button class="btn btn-danger" onclick="handleClickToDelete('${
           job._id
         }','${
      job.jobName
    }')">Xóa <i class="fas fa-trash-alt"></i></button></td>

       </tr>`;
  });
  document.querySelector("tbody").innerHTML = htmls.join("");
}
// Delete Job
function handleClickToDelete(id, jobName) {
  if (
    confirm(
      `Bạn có chắc chắn muốn xóa công việc "${jobName}" này khỏi danh sách không?`
    )
  ) {
    fetch("http://localhost:4000/api/jobs/" + id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        getJobs();
      });
  } else {
    return;
  }
}
//Post Job
const form = document.querySelector(".form");
const namejob = document.querySelector("#namejob");
const descjob = document.querySelector("#descjob");
const btnCancel = document.querySelector(".btnCancel");
const btnUpdate = document.querySelector(".btnUpdate");
const btnSubmitCreate = document.querySelector(".btnSubmitCreate");
const btnCteate = document.querySelector(".createBtn");

btnCteate.onclick = function () {
  form.style.top = "100px";
  namejob.value = "";
  descjob.value = "";
  btnSubmitCreate.removeAttribute("disabled");
  btnUpdate.setAttribute("disabled", "");
};
btnSubmitCreate.onclick = () => {
  if (document.querySelector("#namejob").value !== "") {
    dataCreate = {
      jobName: namejob.value,
      jobDesc: descjob.value,
    };
    fetch("http://localhost:4000/api/jobs/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataCreate),
    })
      .then((response) => response.json())
      //Then with the data from the response in JSON...
      .then((data) => {
        alert("Success: Thêm công việc thành công");
        getJobs();
      })
      //Then with the error genereted...
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    alert("Bạn phải nhập tên công việc !!!");
  }
};
//  Update Job

function handleClickToUpdate(id, jobName, jobDesc) {
  form.style.top = "100px";
  namejob.value = jobName;
  descjob.value = jobDesc;
  form.querySelector("span").innerHTML = id;
  btnUpdate.removeAttribute("disabled");
  btnSubmitCreate.setAttribute("disabled", "");
}
btnCancel.addEventListener("click", () => {
  form.style.top = "-400px";
});

function handleSubmit() {
  // e.preventDefault();

  let id = document.querySelector("span[class='none']").textContent;
  dataUpdate = {
    jobName: namejob.value,
    jobDesc: descjob.value,
    jobState: true,
  };

  console.log(dataUpdate);
  fetch("http://localhost:4000/api/jobs/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataUpdate),
  })
    .then((response) => response.json())
    //Then with the data from the response in JSON...
    .then((data) => {
      console.log("Success:", data);
      getJobs();
    })
    //Then with the error genereted...
    .catch((error) => {
      console.error("Error:", error);
    });
}
function checkboxClick(id, state) {
  if (confirm(`Bạn có chắc chắn muốn lưu trạng thái công việc không?`)) {
    dataState = {
      jobState: !state,
    };
    fetch("http://localhost:4000/api/jobs/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataState),
    })
      .then((response) => response.json())
      //Then with the data from the response in JSON...
      .then((data) => {
        console.log("Success:", data);
        getJobs();
      })
      //Then with the error genereted...
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    getJobs();
  }
}
document.querySelector(".btn_select_all").onclick = () => {
  getJobs();
};

// Search job
$(document).ready(function () {
  $("#myInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#myTable tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});

$(document).ready(function () {
  function filterJobs(bool) {
    fetch("http://localhost:4000/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        const Jobs = data.filter((item, index) => item.jobState === bool);
        renderJobs(Jobs);
      })
      .catch((error) => console.log(error));
  }
  // filter done jobs
  $(".filter_done_check").on("click", function () {
    filterJobs(false);
  });
  // filter active jobs
  $(".filter_active_check").on("click", function () {
    filterJobs(true);
  });
});

// delete all doneJobs
const btnDeleteAllDone = document.querySelector(".btn_delete_all_done");
btnDeleteAllDone.onclick = function () {
  if (
    confirm(
      `Bạn có chắc chắn muốn xóa tất cả các công việc đã hoàn thành khỏi danh sách không?`
    )
  ) {
    fetch("http://localhost:4000/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        const doneJobs = data.filter((item, index) => item.jobState === false);
        doneJobs.forEach((item) => {
          fetch("http://localhost:4000/api/jobs/" + item._id, {
            method: "DELETE",
          })
            .then((res) => res.json())
            .then(() => {
              getJobs();
            });
        });
      })
      .catch((error) => console.log(error));
  } else {
    return;
  }
};
