const url = "http://localhost:8181/";

const addListBtn = `
  	<button class="btn btn-sm btn-new-list text-left" data-toggle="modal" data-target="#add-list-modal">
        <i class="fa fa-plus"></i>&nbsp;&nbsp;Add another list
	</button>
  	<div style="width: 0.5rem">&nbsp;</div>
`;

window.onload = () => {
  	console.log("DOM is ready!");
  	limitWrapperHeight();
  	fetchListData();
};

function limitWrapperHeight() {
  	const body = document.documentElement.clientHeight;
  	const nav1 = document.getElementById("first-nav").clientHeight;
  	const nav2 = document.getElementById("second-nav").clientHeight;
  	const wrapper = document.getElementById("wrapper");
  	wrapper.style.maxHeight = (body - nav1 - nav2) + "px";
  	wrapper.style.minHeight = (body - nav1 - nav2) + "px";
}

function fetchListData(){
	fetch(url+"list")
  		.then(function (response) {
    		return response.json();
  		})
  		.then(function (data) {
    		document.getElementById("wrapper").innerHTML = getList(data) + addListBtn;
  		})
  		.catch(function (err) {
    		console.log(err);
  		});
}

function getList(list){
	var listStr = "";
	for(var i=0; i<list.length; i++){

		listStr = listStr + 
		`
		<div class="list">
    		<div class="d-flex justify-content-between align-items-center mb-1">
      			<h6 class="pl-2">${list[i].title}</h6>
      			<button class="btn btn-sm" data-toggle="modal" data-target="#list-action-modal"><i class="fa fa-ellipsis-h"></i></button>
    		</div>

  			${getCard(list[i].cards)}

    		<div class="d-flex justify-content-between align-items-center">
      			<button class="btn btn-sm btn-new-card text-left" id="add-new-card">
        			<i class="fa fa-plus"></i>&nbsp;&nbsp;Add another card
      			</button>
      			<button class="btn btn-sm"><i class="fa fa-window-restore"></i></button>
    		</div>
		</div>

		`;
	}

	return listStr;
}

function getCard(cards){
	var cardStr = "";
	for(var i=0; i<cards.length; i++){
		cardStr = cardStr +
		`
		<div class="card" data-toggle="modal" data-target="#card-modal" onclick="cardClicked($(this).attr('list-title'), $(this).attr('card-id'))" list-title="${cards[i].list.title}" card-id="${cards[i].id}">
    		${getLabel(cards[i].labels)}
      		<p>${cards[i].title}</p>
      		<div class="d-flex justify-content-end">
  				${getMember(cards[i].accounts)}
			</div>
    	</div>
		`;
	}
	return cardStr;
}

function getLabel(labels){
	var labelStr = "";

	if(labels.length != 0){
		for(var i=0; i<labels.length; i++){
			labelStr = labelStr +
			`
			<div class="card-label" style="background-color: ${labels[i].color};"></div>
			`;
		}
	}
	return labelStr;
}


function getMember(accounts){
	var memberStr = "";

	if(accounts.length != 0){
		for(var i=0; i<accounts.length; i++){

			memberStr = memberStr +
			`
			<div class="card-member m-1">${getInitials(accounts[i].name)}</div>
			`;
		}
	}
	return memberStr;
}

function getChecklist(checklists){
	var checklistStr = "";

	if(checklists.length != 0){
		for(var i=0; i<checklists.length; i++){

			checklistStr = checklistStr +
			`
			<label class="cb-container">${checklists[i].title}
  				<input type="checkbox" ${checklists[i].checked ? "checked='checked'": ""}>
  				<span class="checkmark"></span>
			</label>
			`;
		}
	}
	else{
		checklistStr = "No checklist";
	}

	return checklistStr;
}

function getInitials(name){
	var initials;

	var names = name.split(' '),
        initials = names[0].substring(0, 1).toUpperCase();
    
    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
}

function cardClicked(listTitle, cardId){
	fetch(url+"card/"+cardId)
  		.then(function (response) {
    		return response.json();
  		})
  		.then(function (card) {

    		document.getElementById("card-title").innerHTML = card.title;
  			document.getElementById("list-title").innerHTML = listTitle;
  			document.getElementById("card-member").innerHTML = getMember(card.accounts);
  			document.getElementById("card-desc").innerHTML = card.description;
  			document.getElementById("card-checklist").innerHTML = getChecklist(card.checklists)
  		})
  		.catch(function (err) {
    		console.log(err);
  		});

}