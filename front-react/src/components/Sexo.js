const sexo = {
    Masculino: 'Masculino',
    Femenino: 'Femenino',
}
export default Object.keys(sexo).map(value => ({
    value,
    label: sexo[value]
}))