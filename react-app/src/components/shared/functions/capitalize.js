// Returns the given word with the first letter being a capital letter
const capitalize = (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export default capitalize;