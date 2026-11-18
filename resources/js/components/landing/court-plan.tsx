import { useEffect, useId, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utils';

/**
 * Padel court drawn to its real geometry, in centimetres:
 * 20 m long, 10 m wide, service lines 6.95 m from the net,
 * centre service line running 20 cm past each service line.
 */
const COURT_LENGTH = 2000;
const COURT_WIDTH = 1000;
const SERVICE_LINE_FROM_WALL = 305;
const CENTRE_LINE_OVERRUN = 20;

type Point = [number, number];
type Segment = { from: Point; to: Point; delay: number; weight?: number };

const landscapeSegments: Segment[] = [
    { from: [0, 0], to: [COURT_LENGTH, 0], delay: 0 },
    { from: [COURT_LENGTH, 0], to: [COURT_LENGTH, COURT_WIDTH], delay: 0.08 },
    { from: [COURT_LENGTH, COURT_WIDTH], to: [0, COURT_WIDTH], delay: 0.16 },
    { from: [0, COURT_WIDTH], to: [0, 0], delay: 0.24 },
    {
        from: [SERVICE_LINE_FROM_WALL, 0],
        to: [SERVICE_LINE_FROM_WALL, COURT_WIDTH],
        delay: 0.32,
    },
    {
        from: [COURT_LENGTH - SERVICE_LINE_FROM_WALL, 0],
        to: [COURT_LENGTH - SERVICE_LINE_FROM_WALL, COURT_WIDTH],
        delay: 0.32,
    },
    {
        from: [SERVICE_LINE_FROM_WALL - CENTRE_LINE_OVERRUN, COURT_WIDTH / 2],
        to: [
            COURT_LENGTH - SERVICE_LINE_FROM_WALL + CENTRE_LINE_OVERRUN,
            COURT_WIDTH / 2,
        ],
        delay: 0.44,
    },
];

const netSegment: Segment = {
    from: [COURT_LENGTH / 2, -18],
    to: [COURT_LENGTH / 2, COURT_WIDTH + 18],
    delay: 0.56,
    weight: 2.4,
};

/**
 * Cross-court serve seen from above (a straight line in plan view):
 * from the left back zone, lower half, into the opposite service box.
 */
const serveFrom: Point = [160, 760];
const serveTo: Point = [1640, 440];

type Orientation = 'landscape' | 'portrait';

function orient([x, y]: Point, orientation: Orientation): Point {
    return orientation === 'landscape' ? [x, y] : [y, COURT_LENGTH - x];
}

function segmentPath(segment: Segment, orientation: Orientation): string {
    const [x1, y1] = orient(segment.from, orientation);
    const [x2, y2] = orient(segment.to, orientation);

    return `M${x1} ${y1} L${x2} ${y2}`;
}

type CourtPlanProps = {
    orientation?: Orientation;
    /** Draw lines on mount and fly the serve. */
    animated?: boolean;
    /** Draw lines once the court scrolls into view. */
    animateInView?: boolean;
    showServe?: boolean;
    lineWidth?: number;
    className?: string;
};

export function CourtPlan({
    orientation = 'landscape',
    animated = false,
    animateInView = false,
    showServe = false,
    lineWidth = 10,
    className,
}: CourtPlanProps) {
    const maskId = useId();
    const prefersReducedMotion = usePrefersReducedMotion();
    const svgRef = useRef<SVGSVGElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const element = svgRef.current;

        if (!animateInView || !element) {
            return;
        }

        if (typeof IntersectionObserver === 'undefined') {
            setIsInView(true);

            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 },
        );
        observer.observe(element);

        return () => observer.disconnect();
    }, [animateInView]);

    const shouldAnimate =
        (animated || (animateInView && isInView)) && !prefersReducedMotion;
    const isWaitingForView =
        animateInView && !isInView && !prefersReducedMotion;

    const viewBox =
        orientation === 'landscape'
            ? `0 0 ${COURT_LENGTH} ${COURT_WIDTH}`
            : `0 0 ${COURT_WIDTH} ${COURT_LENGTH}`;

    const [fromX, fromY] = orient(serveFrom, orientation);
    const [toX, toY] = orient(serveTo, orientation);
    const servePath = `M${fromX} ${fromY} L${toX} ${toY}`;

    const ballRadius = 15;
    const ballStart = shouldAnimate ? [fromX, fromY] : [toX, toY];

    return (
        <svg
            ref={svgRef}
            viewBox={viewBox}
            aria-hidden="true"
            className={cn('block size-full overflow-visible', className)}
        >
            <g
                fill="none"
                stroke="var(--color-line)"
                strokeLinecap="square"
                strokeWidth={lineWidth}
            >
                {landscapeSegments.map((segment, index) => (
                    <path
                        key={index}
                        d={segmentPath(segment, orientation)}
                        pathLength={1}
                        className={
                            shouldAnimate
                                ? 'court-line-draw'
                                : isWaitingForView
                                  ? 'court-line-pending'
                                  : undefined
                        }
                        style={
                            shouldAnimate
                                ? { animationDelay: `${segment.delay}s` }
                                : undefined
                        }
                    />
                ))}
            </g>

            <g
                fill="none"
                stroke="var(--color-line)"
                strokeOpacity={0.85}
                strokeWidth={lineWidth * (netSegment.weight ?? 1)}
            >
                <path
                    d={segmentPath(netSegment, orientation)}
                    pathLength={1}
                    className={
                        shouldAnimate
                            ? 'court-line-draw'
                            : isWaitingForView
                              ? 'court-line-pending'
                              : undefined
                    }
                    style={
                        shouldAnimate
                            ? { animationDelay: `${netSegment.delay}s` }
                            : undefined
                    }
                />
            </g>

            {showServe && (
                <g>
                    <mask id={maskId}>
                        <path
                            d={servePath}
                            fill="none"
                            stroke="white"
                            strokeWidth={12}
                            pathLength={1}
                            className={
                                shouldAnimate ? 'court-line-draw' : undefined
                            }
                            style={
                                shouldAnimate
                                    ? {
                                          animationDelay: '1.05s',
                                          animationDuration: '0.95s',
                                      }
                                    : undefined
                            }
                        />
                    </mask>
                    <path
                        d={servePath}
                        fill="none"
                        stroke="var(--color-ball)"
                        strokeOpacity={0.75}
                        strokeWidth={3}
                        strokeDasharray="4 16"
                        strokeLinecap="round"
                        mask={`url(#${maskId})`}
                    />

                    <circle
                        cx={toX}
                        cy={toY}
                        r={ballRadius * 2.4}
                        fill="none"
                        stroke="var(--color-ball)"
                        strokeOpacity={0.55}
                        strokeWidth={2}
                        className={shouldAnimate ? 'rise-in' : undefined}
                        style={
                            shouldAnimate
                                ? { animationDelay: '1.95s' }
                                : undefined
                        }
                    />

                    <circle
                        cx={shouldAnimate ? 0 : ballStart[0]}
                        cy={shouldAnimate ? 0 : ballStart[1]}
                        r={ballRadius}
                        fill="var(--color-ball)"
                        transform={
                            shouldAnimate
                                ? `translate(${ballStart[0]} ${ballStart[1]})`
                                : undefined
                        }
                    >
                        {shouldAnimate && (
                            <>
                                <animateMotion
                                    path={`M0 0 L${toX - fromX} ${toY - fromY}`}
                                    begin="1.05s"
                                    dur="0.95s"
                                    fill="freeze"
                                    calcMode="spline"
                                    keyTimes="0;1"
                                    keySplines="0.3 0.1 0.35 1"
                                />
                                {/* Ball grows toward the top of its arc, read from above. */}
                                <animate
                                    attributeName="r"
                                    values={`${ballRadius};${ballRadius * 1.7};${ballRadius}`}
                                    keyTimes="0;0.45;1"
                                    begin="1.05s"
                                    dur="0.95s"
                                    fill="freeze"
                                />
                            </>
                        )}
                    </circle>
                </g>
            )}
        </svg>
    );
}
