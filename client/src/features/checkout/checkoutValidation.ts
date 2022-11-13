import * as yup from 'yup';

export const validationSchema = [
    yup.object({ //1st step: Shipping address
        fullName: yup.string().required('Full name is required'),
        address1: yup.string().required('Address line 1 is required'),
        address2: yup.string().required(),
        city: yup.string().required(),
        state: yup.string().required(),
        zip: yup.string().required(),
        country: yup.string().required()
    }),
    yup.object(),//2nd step: review order
    yup.object({ //3rd step: payment details
        nameOnCard: yup.string().required()
    })
]