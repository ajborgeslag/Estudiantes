import React, {useState,useEffect} from 'react'

import {DashboardLayout} from '../components/DashboardLayout';
import { Container, Button } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import baseUrl from "../components/BaseUrl";
import axios from 'axios';
import { Form, Field } from 'react-final-form'
import FormStyle from '../components/FormStyle'
import Select from "react-select";
import profesores from '../components/Profesores';


// Se inicializan las columnas de la tabla grupos
const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'nombre',
        headerName: 'Nombre',
        width: 300,
        editable: false,
    },
    {
        field: 'profesor_guia',
        headerName: 'Profesor Guia',
        width: 300,
        editable: false,
    }
];

// Estilos para mostrar el modal de material
function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

// Vista lista de grupos
const ListGroup = () => {

    const useStyles = makeStyles((theme) => ({
        paper: {
            position: 'absolute',
            width: 400,
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(2, 4, 3),
        },
    }));

    //Se inicializan variables con los estados de React
    const [grupos, setGrupos] = useState([]);
    const [selection, setSelection] = useState([]);
    const [formData, setFormData] = useState({});
    const [modalGrupo, setModalGrupo] = useState(false);
    const [modalStyle] = React.useState(getModalStyle);
    const classes = useStyles();

    // Funcion para crear grupo, se utiliza Axio de forma asincronica
    const onSubmit = async (values) => {
        axios.post(baseUrl()+`/api/grupos/crear`,{
            nombre: values.nombre,
            profesor: values.profesor.value,
        })
            .then(function (response) {
                getGroup();
                setModalGrupo(false);
            })
            .catch(function (error) {

            });
    };

    // Funcion eliminar grupo, se utiliza Axio de forma asincronica
    const onDelete = async () => {
        axios.post(baseUrl()+`/api/grupos/eliminar`,{
            lista: selection,
        })
            .then(function (response) {
                getGroup();
                setModalGrupo(false);
            })
            .catch(function (error) {

            });

    };

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
                    if (!values.profesor) {
                        errors.profesor = "Requerido";
                    }
                    return errors;
                }}
                render = { ({ handleSubmit, form, submitting, pristine, values }) => (
                    <form onSubmit={handleSubmit}>
                        <h2>Nombre</h2>
                        <Field name="nombre" >
                            {({ input, meta }) => (
                                <div>
                                    <input {...input} type="text" placeholder="Nombre" />
                                    {meta.error && meta.touched && <span>{meta.error}</span>}
                                </div>
                            )}
                        </Field>
                        <h2>Profesor</h2>
                        <Field name="profesor"
                               options={profesores}
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
                        <button type="submit" disabled={submitting}>Crear</button>
                    </form>
                )}
            />
            </FormStyle>
        </div>
    );

    // Funcion para listar grupos, se utiliza Axio
    const getGroup = () => {
        axios.get(baseUrl()+'/api/grupos')
            .then(function (response) {
                setGrupos(response.data.data);
                console.log(response.data.data);
            })
            .catch(function (error) {

            });
    }

    //Se renderizan las vistas cuando se modifican los grupos
    useEffect(() => {
        getGroup();
    }, []);

    //Se renderizan las vistas cuando se se selecciona un grupo para eliminar
    useEffect(() => {
        console.log(selection); // <-- The state is updated
    }, [selection]);

    const handleOpen = () => {
        setModalGrupo(true);
    };

    const handleClose = () => {
        setModalGrupo(false);
    };

    //Se inicializa el modal de material
    return (
        <DashboardLayout>
            <Modal
                open={modalGrupo}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
            <div className="min-h-screen">
                <h1 className="mt-8 mb-12 text-center text-5xl">Listar Grupos</h1>
                <Container>
                    <div className="flex">
                        <Button variant="contained" color="primary" onClick={handleOpen}>
                            Crear Grupo
                        </Button>
                        <div className="w-3"></div>
                        { selection.length>0 && <div className="font-bold text-black text-x"><span className="mr-1">¿ Estas seguro que deseas borrar los grupos ?</span><Button variant="contained" color="secondary" onClick={onDelete}>
                            Eliminar
                        </Button>
                        </div>}
                    </div>
                    <div className="h-64 w-full">
                        <DataGrid
                            rows={grupos}
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

export default ListGroup;