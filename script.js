const validateForm = formSelector => {
    const formElement = document.querySelector(formSelector);

    const validateOptions = [
        {
            attribute: "minlength",
            isValid: input => input.value && input.value.length >= parseInt(input.minLength, 10),
            errorMessage: (input, label) => `${label.textContent} needs to be at least ${input.minLength} characters`,
        },

        {
            attribute: "pattern",
            isValid: input => {
                const patternRegex = new RegExp(input.pattern);
                return patternRegex.test(input.value);
            },
            errorMessage: (input, label) => `Not a valid ${label.textContent}`,
        },

        {
            attribute: "match",
            isValid: input => {
                const matchSelector = input.getAttribute("match");
                const matchedElement = formElement.querySelector(`#${matchSelector}`);
                return matchedElement && matchedElement.value.trim() === input.value.trim();
            },
            errorMessage: (input, label) => {
                const matchSelector = input.getAttribute("match");
                const matchedElement = formElement.querySelector(`#${matchSelector}`);
                const matchedLabel = matchedElement.parentElement.querySelector("label");
                return `${label.textContent} does not match ${matchedLabel.textContent}`;
            },
        },

        {
            attribute: "required",
            isValid: input => input.value.trim()!== "" || input.checked,
            errorMessage: (input, label) => `${label.textContent} is required`
        }
    ]
    
    const validateCustomCheckbox = (checkbox, errorContainer) => {
        const formRow = checkbox.closest(".form-row");

        if (formRow) {
            const formRowErrorContainer = formRow.querySelector(".error");
    
            if (formRowErrorContainer) {
                if (!checkbox.checked) {
                    formRowErrorContainer.textContent = "You have to accept this";
                } else {
                    formRowErrorContainer.textContent = "";
                }
            }   
        };
    };

    const validateSingleFormRow = formRow => {
        const label = formRow.querySelector("label");
        const input = formRow.querySelector("input");
        const errorContainer = formRow.querySelector(".error");

        let formRowError = false;
    
        if (input.type !== "checkbox") {
            for (const option of validateOptions) {
                if (input.hasAttribute(option.attribute) && !option.isValid(input)) {
                    errorContainer.textContent = option.errorMessage(input, label);
                    input.classList.add("invalid-input");
                    input.classList.remove("valid-input");
                    formRowError = true;
                };
            };

            if (!formRowError) {
                errorContainer.textContent = "";
                input.classList.remove("invalid-input")
                input.classList.add("valid-input");
            };
        
        } else if (input.type === "checkbox") {
            validateCustomCheckbox(input, errorContainer);
        };
    };

    formElement.setAttribute("novalidate", "");

    formElement.addEventListener("submit", event => {
        const invalidInputs = formElement.querySelectorAll(".invalid-input");
        const terms = formElement.querySelector("#terms");
        const termsError = formElement.querySelector(".terms_error");
        const checkboxLabel = formElement.querySelector(".terms_label");

        if (invalidInputs.length > 0 || !terms.checked) {

            event.preventDefault();  
            console.log("not submited"); 
        };

        if (!terms.checked) {
            termsError.textContent = "You have to accept the Terms!";
            checkboxLabel.classList.add("terms_error_highlight");

        } else if (terms.checked) {
            termsError.textContent = ""
            checkboxLabel.classList.remove("terms_error_highlight");
            ;
        };

        // Add an event listener to the checkbox
        terms.addEventListener("change", () => {
            if (terms.checked) {
                termsError.textContent = "";
                checkboxLabel.classList.remove("terms_error_highlight");
            } else {
                termsError.textContent = "You have to accept the Terms!";
                checkboxLabel.classList.add("terms_error_highlight");
            }
        });

        validateAllFormGroups(formElement);
        
    });
    
    Array.from(formElement.elements).forEach(element => {
        element.addEventListener("input", event => {
            validateSingleFormRow(event.target.parentElement)
        });
    });

    const validateAllFormGroups = formToValidate => {
        const formRows = Array.from(formToValidate.querySelectorAll(".form_row"));

        formRows.forEach(formRow => {
            validateSingleFormRow(formRow);
        });
    };
};

validateForm("#form");
