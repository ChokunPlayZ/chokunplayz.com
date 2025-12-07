import { IconType } from "react-icons";
import { Tooltip } from "react-tippy";

interface TechProps {
    name: string;
    icon: IconType;
}

export const TechItem = ({ icon, name }: { icon: IconType; name: string }) => {
    const TooltipAny = Tooltip as any;
    return (
        <li className="flex p-2">
            <TooltipAny title={name} position={"top"} duration={250}>
                <span>{icon({ className: "h-6 w-6" })}</span>
            </TooltipAny>
        </li>
    );
};
