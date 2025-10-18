import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { IoIosSend } from "react-icons/io";
import { AiFillAudio } from "react-icons/ai";
import { useRef, useState } from "react";
import { ChatProps } from "./types";
import { Form } from "@heroui/react";

export default function TasksChat({ onCreate }: ChatProps) {
  const [text, setText] = useState<string>("");
  const recognitionRef = useRef<any>(null);
  const [recording, setRecording] = useState(false);

  const startRecording = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "es-PE";
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;

      // Send the recognized text to the backend or process it as a task
      onSendAudioMessage(transcript);
    };

    recognitionRef.current.onend = () => {
      if (recording) recognitionRef.current.start();
    };

    recognitionRef.current.start();
    setRecording(true);
  };

  const onSendMessage = async () => {
    await onCreate(text);
    setText("");
  };

  const onChangeInputText = (e: string) => {
    setText(e);
  };

  const onSendAudioMessage = async (text: string) => {
    await onCreate(text);
    setText("");
  };

  const stopRecording = () => {
    setRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="w-full flex gap-3 fixed bottom-0 justify-center max-w-md p-3 bg-background">
      <Form className="flex flex-row w-full gap-3">
        <Input
          value={text}
          onChange={(e) => onChangeInputText(e.target.value || "")}
          title="Message"
          radius="full"
          placeholder="Write your task"
        />
        <Button
          type="submit"
          onClick={() => onSendMessage()}
          isIconOnly
          isDisabled={!text}
          radius="full"
          color="primary"
          variant="flat"
        >
          <IoIosSend size={20} />
        </Button>
      </Form>
      <Button
        isIconOnly
        onClick={recording ? stopRecording : startRecording}
        radius="full"
        color={recording ? "danger" : "primary"}
        variant={recording ? "shadow" : "flat"}
      >
        <AiFillAudio size={20} />
      </Button>
    </div>
  );
}
