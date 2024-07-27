async function addNewService(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const files = document.getElementById("images").files;
    
    const formValues = {};
    formData.entries().forEach((val) => {
       const [field,value] = val;
       if(field === "images") return;
            formValues[field] = value;
    })
    const result = await apiCall("services","POST",JSON.stringify({
        service:formValues
    }),true);
    
    // const fileData = {
    //     files,
    //     serviceId: result.serviceId
    // }
    // const uploadRes = await fetch("http://localhost:8000/upload",{
    //     body:fileData,
    //     method:'POST'
    // });
    // const uploadData = await uploadRes.json();
    // console.log("uploadData: ",uploadData);

}