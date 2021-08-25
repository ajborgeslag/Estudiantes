const profesores = {
    Pedro: 'Pedro',
    Juan: 'Juan',
}
export default Object.keys(profesores).map(value => ({
    value,
    label: profesores[value]
}))