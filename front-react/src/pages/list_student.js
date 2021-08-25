import React, {useState,useEffect} from 'react'

import {DashboardLayout} from '../components/DashboardLayout';
import { Container, Button } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import baseUrl from "../components/BaseUrl";
import axios from 'axios';
import { Form, Field } from 'react-final-form';
import Select from 'react-select';
import FormStyle from '../components/FormStyle';
import sexo from '../components/Sexo';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

// Se inicializan las columnas de la tabla estudiantes
const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'nombre',
        headerName: 'Nombre',
        width: 200,
        editable: false,
    },
    {
        field: 'email',
        headerName: 'Correo',
        width: 250,
        editable: false,
    },
    {
        field: 'sexo',
        headerName: 'Sexo',
        width: 150,
        editable: false,
    },
    {
        field: 'edad',
        headerName: 'Edad',
        width: 150,
        editable: false,
    },
    {
        field: 'fecha_nacimiento',
        headerName: 'Fecha Nacimiento',
        width: 200,
        editable: false,
    },
    {
        field: 'lugar_nacimiento',
        headerName: 'Lugar Nacimiento',
        width: 250,
        editable: false,
    },
    {
        field: 'grupo',
        headerName: 'Grupo',
        width: 200,
        editable: false,
    }
];

// Estilos para mostrar el modal de material
function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

// Vista lista de grupos
const ListStudent = () => {

    const useStyles = makeStyles((theme) => ({
        paper: {
            position: 'absolute',
            width: 400,
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(2, 4, 3),
        },
    }));

    const containerDiv = makeStyles((theme) => ({
        paper: {

        },
    }));

    //Se inicializan variables con los estados de React
    const [estudiantes, setEstudiantes] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [selection, setSelection] = useState([]);
    const [formData, setFormData] = useState({});
    const [modalEstudiente, setModalEstudiante] = useState(false);
    const [modalStyle] = React.useState(getModalStyle);
    const classes = useStyles();
    const classesContainerFields = containerDiv();
    const [startDate, setStartDate] = useState(new Date());

    // Funcion para listar grupos, se utiliza Axio
    const getGroup = () => {
        axios.get(baseUrl()+'/api/grupos')
            .then(function (response) {
                var gruposTemp = Array();
                response.data.data.map((v)=>{
                    gruposTemp.push({value: v.id, label: v.nombre});
                });
                setGrupos(gruposTemp);
            })
            .catch(function (error) {

            });
    }

    // Funcion para listar ciudades, se utiliza Axio
    const getCiudades = () => {
        axios.get(baseUrl()+'/api/ciudades')
            .then(function (response) {
                var ciudadesTemp = Array();
                response.data.data.map((v)=>{
                    ciudadesTemp.push({value: v.id, label: v.nombre});
                });
                setCiudades(ciudadesTemp);
            })
            .catch(function (error) {

            });
    }

    // Funcion para crear estudiante, se utiliza Axio de forma asincronica
    const onSubmit = async (values) => {
        console.log(values)
        axios.post(baseUrl()+`/api/estudiantes/crear`,{
            nombre: values.nombre,
            grupo: values.grupo.value,
            sexo: values.sexo.value,
            edad: values.edad,
            lugar_nacimiento: values.lugar_nacimiento.value,
            fecha_nacimiento: values.fecha_nacimiento,
            email: values.email
        })
            .then(function (response) {
                getEstudiantes();
                setModalEstudiante(false);
            })
            .catch(function (error) {

            });
    };

    // Funcion eliminar grupo, se utiliza Axio de forma asincronica
    const onDelete = async () => {
        axios.post(baseUrl()+`/api/estudiantes/eliminar`,{
            lista: selection,
        })
            .then(function (response) {
                getEstudiantes();
                setModalEstudiante(false);
            })
            .catch(function (error) {

            });

    };

    const ReactSelectAdapter = ({ input, meta, ...rest }) => (
        <Select {...input}  {...rest} searchable/>
    )

    //Se inicializa el formulario para mostrar en el modal, se usa React Form final
    const body = (
        <div style={modalStyle} className={classes.paper}>
            <FormStyle>
                <Form
                    onSubmit={onSubmit}
                    initialValues={formData}
                    validate={(values) => {
                        const errors = {};
                        if (!values.nombre) {
                            errors.nombre = "Requerido";
                        }
                        if (!values.edad) {
                            errors.edad = "Requerido";
                        }
                        else
                        {
                            if(isNaN(values.edad))
                                errors.edad = "Solo números";
                        }
                        if (!values.sexo) {
                            errors.sexo = "Requerido";
                        }
                        if (!values.grupo) {
                            errors.grupo = "Requerido";
                        }
                        if (!values.lugar_nacimiento) {
                            errors.lugar_nacimiento = "Requerido";
                        }
                        if (!values.fecha_nacimiento) {
                            errors.fecha_nacimiento = "Requerido";
                        }
                        if (!values.email) {
                            errors.email = "Requerido";
                        }
                        else
                        {
                            if (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(values.email)!=true)
                                errors.email = "Inválido";
                        }

                        return errors;
                    }}
                    render = { ({ handleSubmit, form, submitting, pristine, values }) => (
                        <form onSubmit={handleSubmit}>
                            <h2>Nombre</h2>
                            <Field name="nombre" >
                                {({ input, meta }) => (
                                    <div className="flex flex-col">
                                        <input {...input} type="text" placeholder="Nombre" />
                                        <div className="text-red-600">
                                            {meta.error && meta.touched && <span>{meta.error}</span>}
                                        </div>
                                    </div>
                                )}
                            </Field>
                            <h2>Edad</h2>
                            <Field name="edad" >
                                {({ input, meta }) => (
                                    <div className="flex flex-col">
                                        <input {...input} type="text" placeholder="Edad" />
                                        <div className="text-red-600">
                                            {meta.error && meta.touched && <span>{meta.error}</span>}
                                        </div>
                                    </div>
                                )}
                            </Field>
                            <h2>Sexo</h2>
                            <Field name="sexo"
                                   options={sexo}
                            >
                                {({ input, meta , ...rest }) => (
                                    <div className="flex flex-col">
                                        <Select {...input}  {...rest} searchable />
                                        <div className="flex text-red-600">
                                            {meta.error && meta.touched && <span>{meta.error}</span>}
                                        </div>
                                    </div>
                                )}
                            </Field>
                            <h2>Grupo</h2>
                            <Field name="grupo"
                                   options={grupos}
                            >
                                {({ input, meta , ...rest }) => (
                                    <div className="flex flex-col">
                                        <Select {...input}  {...rest} searchable />
                                        <div className="flex text-red-600">
                                            {meta.error && meta.touched && <span>{meta.error}</span>}
                                        </div>
                                    </div>
                                )}
                            </Field>
                            <h2>Email</h2>
                            <Field name="email">
                                {({ input, meta }) => (
                                    <div>
                                        <input {...input} type="text" placeholder="Correo" />
                                        <div className="flex text-red-600">
                                            {meta.error && meta.touched && <span>{meta.error}</span>}
                                        </div>
                                    </div>
                                )}
                            </Field>
                            <h2>Lugar de nacimiento</h2>
                            <Field name="lugar_nacimiento"
                                   options={ciudades}
                            >
                                {({ input, meta , ...rest }) => (
                                    <div className="flex flex-col">
                                        <Select {...input}  {...rest} searchable />
                                        <div className="flex text-red-600">
                                            {meta.error && meta.touched && <span>{meta.error}</span>}
                                        </div>
                                    </div>
                                )}
                            </Field>
                            <h2>Fecha de nacimiento</h2>
                            <Field name="fecha_nacimiento"
                                   dateFormat="dd/MM/yyyy"

                            >
                                {({ input: { onChange, value }, meta , ...rest }) => (
                                    <div className="flex flex-col">
                                        <DatePicker selected={value} onChange={date => onChange(date)} {...rest} />
                                        <div className="flex text-red-600">
                                            {meta.error && meta.touched && <span>{meta.error}</span>}
                                        </div>
                                    </div>
                                )}
                            </Field>
                            <button type="submit" disabled={submitting}>Crear</button>
                        </form>
                    )}
                />
            </FormStyle>
        </div>
    );

    // Funcion para listar grupos, se utiliza Axio
    const getEstudiantes = () => {
        axios.get(baseUrl()+'/api/estudiantes')
            .then(function (response) {
                setEstudiantes(response.data.data);
                console.log(response.data.data);
            })
            .catch(function (error) {

            });
    }

    //Se renderizan las vistas cuando se modifican los grupos
    useEffect(() => {
        getGroup();
        getEstudiantes();
        getCiudades();

    }, []);

    //Se renderizan las vistas cuando se se selecciona un grupo para eliminar
    useEffect(() => {
    }, [selection]);

    const handleOpen = () => {
        setModalEstudiante(true);
    };

    const handleClose = () => {
        setModalEstudiante(false);
    };

    //Se inicializa el modal de material
    return (
        <DashboardLayout>
            <Modal
                open={modalEstudiente}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
            <div className="min-h-screen">
                <h1 className="mt-8 mb-12 text-center text-5xl">Listar Estudiantes</h1>
                <Container>
                    <div className="flex">
                        <Button variant="contained" color="primary" onClick={handleOpen}>
                            Crear Estudiante
                        </Button>
                        <div className="w-3"></div>
                        { selection.length>0 && <div className="font-bold text-black text-x"><span className="mr-1">¿ Estas seguro que deseas borrar los estudiantes ?</span><Button variant="contained" color="secondary" onClick={onDelete}>
                            Eliminar
                        </Button>
                        </div>}
                    </div>
                    <div className="h-64 overflow-x-auto">
                        <DataGrid

                            rows={estudiantes}
                            columns={columns}
                            pageSize={5}
                            checkboxSelection
                            onSelectionModelChange={(newSelectionModel) => {
                                setSelection(newSelectionModel);
                            }}
                        />
                    </div>
                </Container>
            </div>
        </DashboardLayout>
    )
}

export default ListStudent;