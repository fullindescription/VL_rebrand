import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


type SessionDetailsProps = {
    show: boolean;
    onHide: () => void;
    sessionInfo: string; // можете изменить это на подходящий тип данных для вашего случая
};

const SessionDetails: React.FC<SessionDetailsProps> = ({ show, onHide, sessionInfo }) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Информация о сеансе</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{sessionInfo}</p> {/* Замените на нужную информацию */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SessionDetails;
