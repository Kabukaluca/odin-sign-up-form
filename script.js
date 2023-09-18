const validateForm = formSelector => {
    const formElement = document.querySelector(formSelector);

    const validateOptions = [
        {
            attribute: "required",
            isValid: input => input.value.trim()!== "",
            errorMessage: (input, label) => `${label.textContent} is required`
        }
    ]
    
    const validateSingleFormRow = formRow => {
        const label = formRow.querySelector("label");
        const input = formRow.querySelector("input");
        const errorContainer = formRow.querySelector(".error");

        for(const option of validateOptions) {
            if(input.hasAttribute(option.attribute) && !option.isValid(input)) {
                errorContainer.textContent = option.errorMessage(input, label);
            }
        }
    }

    formElement.setAttribute("novalidate", "");
    
    formElement.addEventListener("submit", event => {
        event.preventDefault();
        validateAllFormGroups(formElement);
    });

    const validateAllFormGroups = formToValidate => {
        const formRows = Array.from(formToValidate.querySelectorAll(".form_row"));

        formRows.forEach(formRow => {
            validateSingleFormRow(formRow);
        });
    }
      
};

validateForm("#form");
