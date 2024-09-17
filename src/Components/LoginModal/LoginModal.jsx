import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { RiCloseCircleLine } from "react-icons/ri";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import FirebaseData from "@/utils/Firebase";
import { loginUser, signupLoaded, observeAuthState, selectUser, loadUpdateUserData, loginLoaded } from "@/store/reducer/authSlice";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { Fcmtoken, settingsData } from "@/store/reducer/settingsSlice";
import { translate } from "@/utils";



const LoginModal = ({ isOpen, onClose }) => {
  const FcmToken = useSelector(Fcmtoken);
  const navigate = useRouter();
  const { authentication } = FirebaseData();
  const dispatch = useDispatch();
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAsesor, setAsesorRegistro] = useState(false);

  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    city: "",
    state: "",
    country: "",
    cargo: "",
    cedula: ""
  });

  const user = useSelector(selectUser);

  const onCloseLogin = () => {
    onClose();
    setIsRegistering(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData({ ...registrationData, [name]: value });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword, name, phone, city, state, country, cargo, cedula } = registrationData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return;
    }

    try {
      const response = await createUserWithEmailAndPassword(authentication, email, password);

      signupLoaded(
          name,
          email,
          phone,
          "0",
          "",
          response?.user?.uid,
          "",
          "",
          FcmToken,
          cargo,
          city,
          state,
          country,
          cedula,
          (res) => {
              let signupData = res.data;
              if (!res.error) {
                  toast.success("Registration successful! We have sent you a link to verify your email");
                  onCloseLogin();
                  navigate.push("/");
              }
          },
          (err) => {

          }
      );


    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Evita el comportamiento predeterminado del formulario

    const { email, password } = registrationData; // Extrae email y password del objeto registrationData

    try {
      const response = await signInWithEmailAndPassword(authentication, email, password); // Intenta iniciar sesión

      loginLoaded(
          "",
          email,
          "",
          "0",
          "",
          response?.user?.uid,
          "",
          "",
          FcmToken,
          "",
          "",
          "",
          "",
          "",
          (res) => {
              let signupData = res.data;

              if (!res.error) {
                  toast.success("Login successful"); // Muestra mensaje de éxito
                  onCloseLogin(); // Cierra el formulario o modal de inicio de sesión
                  loadUpdateUserData(res.data);
                  //navigate.push("/");
              }
          },
          (err) => {

          }
      );

      
    } catch (error) {
      console.error(error); // Imprime el error en la consola
      toast.error("Login failed"); // Muestra mensaje de error
    }
  };


  const setRegistroBasic = async (e) => {
    setIsRegistering(true);
    setAsesorRegistro(false);
  }

  const setRegistroAsesor = async (e) => {
    setIsRegistering(true);
    setAsesorRegistro(true);
  }


  return (
    <>
      <Modal
        show={isOpen}
        onHide={onCloseLogin}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        className="login-modal"
      >
        <Modal.Header>
          <Modal.Title>{isRegistering ? translate("SignUp") : translate("SignIn")}</Modal.Title>
          <RiCloseCircleLine className="close-icon" size={40} onClick={onCloseLogin} />
        </Modal.Header>
        <Modal.Body>
          {isRegistering ? (
            <form onSubmit={handleRegistration}>
              <div className="modal-body-heading">
                <h4>{translate("login&Regiser")}</h4>
                <span>{translate("filldata")}</span>
              </div>
              <div className="form-group">
                <label>{translate("firstName")}</label>
                <input
                  type="text"
                  name="name"
                  value={registrationData.name}
                  onChange={handleInputChange}
                  placeholder={translate("namePlaceholder")}
                  required
                />
              </div>
              <div className="form-group">
                <label>{translate("email")}</label>
                <input
                  type="email"
                  name="email"
                  value={registrationData.email}
                  onChange={handleInputChange}
                  placeholder={translate("emailplaceholder")}
                  required
                />
              </div>
              <div className="form-group">
                <label>{translate("phoneNumber")}</label>
                <input
                  type="text"
                  name="phone"
                  value={registrationData.phone}
                  onChange={handleInputChange}
                  placeholder={translate("phoneplaceholder")}
                  required
                />
              </div>
              <div className="form-group">
                <label>{translate("Password")}</label>
                <input
                  type="password"
                  name="password"
                  value={registrationData.password}
                  onChange={handleInputChange}
                  placeholder={translate("passplaceholder")}
                  required
                />
              </div>
              <div className="form-group">
                <label>{translate("confrim")} {translate("Password")}</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={registrationData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder={translate("confrim") + " password"}
                  required
                />
              </div>
              <div className="form-group">
                  <label>{translate("city")}</label>
                  <select name="city" onChange={handleInputChange}>
                    <option>{translate("SelectOption")}</option>
                    <option value="BOG">Bogota</option>   			
                    <option value="VILL">Villavicencio</option>   	
                    <option value="IBA">Ibagué</option>   			
                    <option value="BUC">Bucaramanga</option>   		
                    <option value="VAPR">Valledupar</option>   		
                    <option value="MDE">Medellin</option>   		
                    <option value="ARM">Armenia</option>   			
                    <option value="PER">Pereira</option>   			
                    <option value="MAN">Manizales</option>   		
                    <option value="CUC">Cucuta</option>   			
                    <option value="CAL">Cali</option>   			
                    <option value="POP">Popayán</option>   			
                    <option value="PAS">Pasto</option>   			
                    <option value="NEI">Neiva</option>   			
                    <option value="TUN">Tunja</option>   			
                    <option value="BAQ">Barranquilla</option>   	
                    <option value="CTG">Cartagena</option>   		
                    <option value="MON">Monteria</option>   		
                    <option value="STM">Santa Marta</option>   		
                    <option value="SIN">Sincelejo</option>   		

                  </select>
              </div>
              <div className="form-group">
                <label>{translate("state")}</label>
                <input
                  type="text"
                  name="state"
                  value={registrationData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>{translate("country")}</label>
                <input
                  type="text"
                  name="country"
                  value={registrationData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {
                isAsesor ? (
                 <>
                    <div className="form-group">
                      <label>{translate("Identity")}</label>
                      <input
                        type="text"
                        name="cedula"
                        value={registrationData.cedula}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>{translate("Role")}</label>
                      <select name="cargo" onChange={handleInputChange}>
                        <option>{translate("SelectOption")}</option>
                        <option value="asesor">Asesor</option>
                        <option value="director">Director Comercial</option>
                      </select>
                    </div>
                 </>
                ) : ""
              }
              <div className="continue">
                <button type="submit" className="continue-button">{translate("SignUp")}</button>
              </div>
            </form>
          ) : (
            <>
              <form onSubmit={handleLogin}>
                <div className="modal-body-heading">
                  <span>{translate("loginText")} </span>
                </div>
                <div className="form-group">
                  <label>{translate('email')}</label>
                  <input
                    type="email"
                    name="email"
                    value={registrationData.email}
                    onChange={handleInputChange}
                    placeholder={translate("emailplaceholder")}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{translate("Password")}</label>
                  <div class="input-group">
                    <input
                      type="password"
                      name="password"
                      value={registrationData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <span class="input-group-text" id="basic-addon2"><i class="fa fa-eye" /></span>
                  </div>
                </div>
                <div className="continue">
                  <button type="submit" className="continue-button">{translate("SignIn")}</button>
                </div>
              </form>
              <div className="divider">
                <hr />
                <span>{translate("Or")}</span>
                <hr />
              </div>
              <div className="signup-link">
                <span>{translate("no_account")}</span>
                <button onClick={() => setRegistroBasic() } className="continue-button">{translate("Signupnow")}</button>
                <button onClick={() => setRegistroAsesor() } className="continue-button mt-2">{"Registro como asesor"}</button>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <span>
            {translate("terms")}{" "}
            <Link href="/terms-and-condition">{translate("TermsandConditions")}</Link> {translate("and")}{" "}
            <Link href="/privacy-policy">{translate("PrivacyPolicy")}</Link>.
          </span>
        </Modal.Footer>
      </Modal>
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #fff;
          padding: 2rem;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          border-radius: 8px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .modal-body {
          text-align: center;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group input, .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }

        .btn {
          display: block;
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 1rem;
        }

        .btn-primary {
          background-color: #007bff;
          color: #fff;
          transition: background-color 0.3s ease;
        }

        .btn-primary:hover {
          background-color: #0056b3;
        }

        .btn-google {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          color: #4285f4;
          border: 1px solid #4285f4;
        }

        .btn-google span {
          margin-left: 0.5rem;
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 1.5rem 0;
        }

        .divider hr {
          flex-grow: 1;
          border: none;
          border-top: 1px solid #ddd;
        }

        .divider span {
          margin: 0 0.5rem;
          color: #888;
        }

        .signup-link {
          text-align: center;
          margin-top: 1.5rem;
        }

        .signup-link a {
          color: #007bff;
          text-decoration: none;
        }

        .signup-link a:hover {
          text-decoration: underline;
        }

        .error-message {
          color: red;
          margin-bottom: 1rem;
        }

        .mt-2{
          margin-top: .9rem !important;
        }
      `}</style>
    </>
  );
};

export default LoginModal;
