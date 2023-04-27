const userNameInput = document.getElementById("userName");
const showDetailsButton = document.getElementById("showDetails");
const profileInfoDiv = document.getElementById("profileInfo");
const reposInfoDiv = document.getElementById("reposInfo");
const sortContainer = document.querySelector(".sort-container");

// using async and await
showDetailsButton.addEventListener("click", async () => {
  const userName = userNameInput.value;
  //request the data from server: fetch api
  const res = await fetch(`https://api.github.com/users/${userName}`);
  const data = await res.json();

  if (res.status == 404) {
    profileInfoDiv.innerHTML = "There is no such profile";
    sortContainer.style.display = "none";
    reposInfoDiv.innerHTML = "";
  } else {
    sortContainer.style.display = "block";
    showProfile(data);
    showReposInfo(userName);
  }
});

// function for showing profile
function showProfile(data) {
  profileInfoDiv.innerHTML = `<div class="card">
        <div class="card-img">
            <img src=${data.avatar_url} alt=${data.name}>
        </div>
        <div class="card-body">
            <div class="card-title">${data.name}</div>
            <div class="card-subHeading">${data.login}</div>
            <div class="card-text">
                <p>${data.bio}</p>
                <p class = "follow-section">${data.followers} followers ${data.following} following</p>

                <button>
                        <a target="_blank" href=${data.html_url}>
                            Do checkout Profile
                        </a>
                </button>
            </div>
        </div>
    </div>`;
}

// function for showing repo info
async function showReposInfo(userName) {
  const res = await fetch(`https://api.github.com/users/${userName}/repos`);
  const projects = await res.json();

  const sortedProjects = projects.sort(
    (a, b) => b.stargazers_count - a.stargazers_count
  );
  renderProjects(sortedProjects);

  const sortOption = document.getElementById("sortOption");
  sortOption.addEventListener("change", () => {
    const selectedOption = sortOption.value;
    let sortedProjects;
    if (selectedOption === "stars") {
      sortedProjects = projects.sort(
        (a, b) => b.stargazers_count - a.stargazers_count
      );
    } else if (selectedOption === "forks") {
      sortedProjects = projects.sort((a, b) => b.forks - a.forks);
    } else if (selectedOption === "size") {
      sortedProjects = projects.sort((a, b) => b.size - a.size);
    }
    renderProjects(sortedProjects);
  });

  function renderProjects(sortedProjects) {
    reposInfoDiv.innerHTML = "";

    for (let i = 0; i < sortedProjects.length; i++) {
      reposInfoDiv.innerHTML += `<div class="card">
                <div class="card-body">
                    <div class="card-title">${sortedProjects[i].name}</div>
                    ${
                      sortedProjects[i].description == null
                        ? '<div class="card-description">No Description</div>'
                        : `<div class="card-description">${sortedProjects[i].description}</div>`
                    }
                    <div class="card-subHeading"> <span>${
                      sortedProjects[i].language
                    }</span>
                    <span> <i class="fa-solid fa-code-fork"></i> ${
                      sortedProjects[i].forks
                    }</span>
                    <span> <i class="fa-solid fa-star"></i> ${
                      sortedProjects[i].stargazers_count
                    }</span>
                    <span>${sortedProjects[i].size} Kb</span>
                    </div>
                    <div class="card-text">
                        <button>
                            <a target="_blank" href=${
                              sortedProjects[i].html_url
                            }>
                                Do checkout Project
                            </a>
                        </button>
                    </div>
                </div>
            </div>`;
    }
  }

  renderProjects(projects);
}
