import axios from 'axios';
import { createCanvas, loadImage} from "canvas";

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

    const prompt = `${actor} ((${setting})) ${style}.`.toLowerCase()
    return prompt;

};

async function rotateImage(base64Image) {
    const canvas = createCanvas();
    const ctx = canvas.getContext('2d');
    const img = await loadImage(base64Image);
    canvas.width = img.height;
    canvas.height = img.width;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(90 * Math.PI / 180);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    const rotatedImage = canvas.toDataURL('image/png');
    return rotatedImage;
}

export const handleImageRequest = async (prompt, image) => {
    image =  await rotateImage(image);

    const json = {
        init_images: [
            image
        ],
        prompt: prompt,
        negative_prompt: 'hitler',
        steps: 20,
        cfg_scale: 5,
        sampler: 'Euler',
        sampler_name: 'Euler',
        width: 378,
        height: 564,
        denoising_strength: 0.4
    };
    const ip = '192.168.212.76'
    const response = await axios.post(`http://${ip}:7860/sdapi/v1/img2img`, json);
    return `data:image/png;base64,${response.data.images[0]}`;
}

