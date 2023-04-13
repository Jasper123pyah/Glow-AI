import axios from 'axios';

function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
}

export const getPrompt = async (actor, action, setting, objects, styles) => {
    await timeout(1000);

    const promptMultiple = (array) => {
        let prompt = '';
        array.forEach((element, index) => {
            if (index === 0) {
                prompt += `${element}`;
            } else {
                prompt += ` and ${element} `;
            }
        });
        return prompt;
    }

    //with ${promptMultiple(objects)}
    const prompt = `${actor} ${action} ${setting} in the styles of ${promptMultiple(styles)}.`.toLowerCase()
    return prompt;

};

export const handleImageRequest = async (prompt, image) => {
    const json = {
        prompt: prompt,
        negative_prompt: 'nude',
        steps: 20,
        cfg_scale: 4.5,
        sampler: 'Euler',
        sampler_name: 'Euler',
        width: 512,
        height: 512
    }
    const response = await axios.post('http://192.168.137.33:7860/sdapi/v1/txt2img', json);
    return response.data.images[0];
}

