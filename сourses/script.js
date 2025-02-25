$(document).ready(function () {
    function filterCards() {
        let selectedLevels = [];
        let selectedSkills = [];
        let selectedTime = [];
        let searchQuery = $(".search-area").val().toLowerCase().trim();

        $("input[name='level']:checked").each(function () {
            selectedLevels.push($(this).val());
        });

        $("input[name='skills']:checked").each(function () {
            selectedSkills.push($(this).val());
        });

        $("input[name='time']:checked").each(function () {
            selectedTime.push($(this).val());
        });

        $(".card-container").each(function () {
            let card = $(this);
            let title = card.find("h2").text().toLowerCase();
            let description = card.find("p").first().text().toLowerCase();
            let cardLevel = card.find(".bottom span:first-child").text().trim().toLowerCase();
            let cardTime = card.find(".bottom span:last-child").text().trim().toLowerCase();
            
            let cardSkills = card
                .find(".skills")
                .text()
                .replace("Key Skills:", "")
                .toLowerCase()
                .split(",")
                .map(skill => skill.trim());

            let matchLevel = (selectedLevels.length === 0) || selectedLevels.includes(cardLevel);
            let matchTime = (selectedTime.length === 0) || selectedTime.includes(cardTime);
            let matchSkills = (selectedSkills.length === 0) ||
                              selectedSkills.some(skill => cardSkills.includes(skill));
            let matchSearch = searchQuery === "" ||
                              title.includes(searchQuery) ||
                              description.includes(searchQuery);

            if (matchLevel && matchTime && matchSkills && matchSearch) {
                card.show();
            } else {
                card.hide();
            }
        });
    }

    $("input[type='checkbox']").on("change", filterCards);

    $(".search-area").on("keyup", filterCards);

    filterCards();
});
