import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface CandidateFormProps {
  onSuccess?: () => void;
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  workExperience: string;
  cv: File | null;
}

const validationSchema = Yup.object({
  firstName: Yup.string().required('Nombre requerido'),
  lastName: Yup.string().required('Apellido requerido'),
  email: Yup.string().email('Correo inválido').required('Correo requerido'),
  phone: Yup.string().required('Teléfono requerido'),
  address: Yup.string(),
  education: Yup.string(),
  workExperience: Yup.string(),
  cv: Yup.mixed()
   .test('fileType', 'Solo PDF o DOCX', (value: unknown) => {
    if (!value) return true;
    if (value instanceof File) {
      return (
        value.type === 'application/pdf' ||
        value.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
    }
    return false;
    }),
});

const CandidateForm: React.FC<CandidateFormProps> = ({ onSuccess }) => {
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      education: '',
      workExperience: '',
      cv: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setError('');
      setSuccess('');
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'cv' && value) {
          formData.append('cv', value as File);
        } else if (value) {
          formData.append(key, value as string);
        }
      });
      try {
        const res = await fetch('/api/candidates', {
          method: 'POST',
          body: formData,
        });
        const result = await res.json();
        if (res.ok) {
          setSuccess(result.message);
          resetForm();
          if (onSuccess) onSuccess();
        } else {
          setError(result.message || 'Error al crear candidato.');
        }
      } catch {
        setError('Error de conexión con el servidor.');
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} style={{
      display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 500, margin: 'auto'
    }}>
      <h2 style={{ textAlign: 'center' }}>Nuevo Candidato</h2>
      <input
        name="firstName"
        placeholder="Nombre*"
        value={formik.values.firstName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
      />
      {formik.touched.firstName && formik.errors.firstName && (
        <div style={{ color: 'red' }}>{formik.errors.firstName}</div>
      )}

      <input
        name="lastName"
        placeholder="Apellido*"
        value={formik.values.lastName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
      />
      {formik.touched.lastName && formik.errors.lastName && (
        <div style={{ color: 'red' }}>{formik.errors.lastName}</div>
      )}

      <input
        name="email"
        type="email"
        placeholder="Correo electrónico*"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
      />
      {formik.touched.email && formik.errors.email && (
        <div style={{ color: 'red' }}>{formik.errors.email}</div>
      )}

      <input
        name="phone"
        placeholder="Teléfono*"
        value={formik.values.phone}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
      />
      {formik.touched.phone && formik.errors.phone && (
        <div style={{ color: 'red' }}>{formik.errors.phone}</div>
      )}

      <input
        name="address"
        placeholder="Dirección"
        value={formik.values.address}
        onChange={formik.handleChange}
        style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
      />

      <input
        name="education"
        placeholder="Educación"
        value={formik.values.education}
        onChange={formik.handleChange}
        style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
      />

      <textarea
        name="workExperience"
        placeholder="Experiencia laboral"
        value={formik.values.workExperience}
        onChange={formik.handleChange}
        style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minHeight: 60 }}
      />

      <input
        name="cv"
        type="file"
        accept=".pdf,.docx"
        onChange={e => {
          if (e.currentTarget.files && e.currentTarget.files[0]) {
            formik.setFieldValue('cv', e.currentTarget.files[0]);
          }
        }}
        style={{ padding: 8 }}
      />
      {formik.errors.cv && (
        <div style={{ color: 'red' }}>{formik.errors.cv as string}</div>
      )}

      <button
        type="submit"
        style={{
          background: '#1976d2', color: '#fff', border: 'none', padding: '10px 0',
          borderRadius: 5, cursor: 'pointer', fontWeight: 600, marginTop: 10
        }}
      >
        Guardar
      </button>
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      {success && <div style={{ color: 'green', textAlign: 'center' }}>{success}</div>}
    </form>
  );
};

export default CandidateForm;