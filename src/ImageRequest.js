import axios from 'axios';

function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
}

export const getPrompt = async (actor, action, setting, objects, style) => {
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
    const prompt = `${actor} ((${setting})) ${style}.`.toLowerCase()
    return prompt;

};

export const handleImageRequest = async (prompt, image) => {
    const json = {
        init_images: [
            image
        ],
        prompt: prompt,
        negative_prompt: 'nude',
        steps: 20,
        cfg_scale: 7,
        sampler: 'Euler',
        sampler_name: 'Euler',
        width: 512,
        height: 512,
        denoising_strength: 0.4
    };
    const ip = '192.168.212.76'
    const response = await axios.post(`http://${ip}:7860/sdapi/v1/img2img`, json);
    return `data:image/png;base64,${response.data.images[0]}`;
}

